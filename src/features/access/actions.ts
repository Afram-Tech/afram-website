"use server";

import { headers } from "next/headers";
import { z } from "zod";

import { graphqlFetch } from "@/graphql/client";
import { REQUEST_ACCESS } from "@/graphql/documents";

import { ACCESS_ROLES, type AccessRole } from "./roles";

/**
 * Afram is invite-only for now: "Create Account" and "Log In" open a request
 * form instead of the app's sign-up. The request goes to the API's
 * `requestAccess`; staff approve or decline it in the admin dashboard, and an
 * approved person gets an email with a temporary password and a set-up link.
 */

const Request = z.object({
  role: z.enum(ACCESS_ROLES, { message: "Choose how you'll use Afram." }),
  name: z.string().trim().min(2, "Please enter your full name.").max(120, "That name is too long."),
  email: z.email("Enter a valid email address.").max(200),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s()-]{7,20}$/, "Enter a valid phone number."),
});

export type AccessState =
  | { status: "idle" }
  | { status: "error"; message: string; field?: "role" | "name" | "email" | "phone" }
  | { status: "received"; email: string; role: AccessRole };

/** The API stores the app's wire values; this site says "Member" for a buyer. */
const WIRE_ROLE: Record<AccessRole, "buyer" | "issuer" | "financier"> = {
  Member: "buyer",
  Vendor: "issuer",
  Financier: "financier",
};

/** The visitor's IP, from the request this server action is answering. The API
 *  rate-limits requestAccess per IP; without this every visitor would share the
 *  website server's IP, and so one limit. */
async function visitorIp(): Promise<string | undefined> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || undefined;
}

async function deliver({ role, name, email, phone }: z.infer<typeof Request>) {
  const ip = await visitorIp();
  const data = await graphqlFetch<
    { requestAccess: { success: boolean; message: string } },
    {
      input: {
        role: "buyer" | "issuer" | "financier";
        fullName: string;
        email: string;
        phone: string;
      };
    }
  >(
    REQUEST_ACCESS,
    { input: { role: WIRE_ROLE[role], fullName: name, email, phone } },
    { mutation: true, headers: ip ? { "X-Forwarded-For": ip } : undefined },
  );
  if (!data.requestAccess.success) throw new Error(data.requestAccess.message || "not accepted");
}

export async function requestAccess(_prev: AccessState, form: FormData): Promise<AccessState> {
  // Spam trap: hidden from people, filled in by bots.
  if (String(form.get("company") ?? "").trim()) {
    return { status: "received", email: String(form.get("email") ?? ""), role: "Member" };
  }

  const parsed = Request.safeParse({
    role: form.get("role"),
    name: form.get("name"),
    email: String(form.get("email") ?? "").trim(),
    phone: form.get("phone"),
  });
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      status: "error",
      message: issue?.message ?? "Please check your details.",
      field: issue?.path[0] as Extract<AccessState, { status: "error" }>["field"],
    };
  }

  try {
    await deliver(parsed.data);
    return { status: "received", email: parsed.data.email, role: parsed.data.role };
  } catch (error) {
    console.error("requestAccess failed:", error instanceof Error ? error.message : error);
    return {
      status: "error",
      message: "We couldn’t send your request just now. Please try again in a moment.",
    };
  }
}
