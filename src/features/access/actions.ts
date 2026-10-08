"use server";

import { z } from "zod";

import { graphqlFetch } from "@/graphql/client";
import { CONTACT_US } from "@/graphql/documents";

import { ACCESS_ROLES, type AccessRole } from "./roles";

/**
 * Afram is invite-only for now: "Create Account" and "Log In" open a request
 * form instead of the app's sign-up.
 *
 * The API has no access-request mutation yet, so a request is delivered to
 * the team through the existing public contactUs mutation, with a subject
 * they can filter on ("Access request: Vendor"). The team approves it and
 * sends the invite from the app. When a dedicated mutation exists, only
 * `deliver` below needs to change.
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

async function deliver({ role, name, email, phone }: z.infer<typeof Request>) {
  const data = await graphqlFetch<
    { contactUs: { success: boolean; message?: string | null } },
    { input: { name: string; email: string; subject: string; message: string } }
  >(
    CONTACT_US,
    {
      input: {
        name,
        email,
        subject: `Access request: ${role}`,
        message: [
          "New access request from the Afram website.",
          "",
          `Role:  ${role}`,
          `Name:  ${name}`,
          `Email: ${email}`,
          `Phone: ${phone}`,
        ].join("\n"),
      },
    },
    { mutation: true },
  );
  if (!data.contactUs.success) throw new Error(data.contactUs.message ?? "not accepted");
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
