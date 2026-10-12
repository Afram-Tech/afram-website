import { z } from "zod";

import type { RequestAccessInput } from "@/types/generated/graphql";

import { ACCESS_ROLES, type AccessRole } from "./roles";

export type AccessField = "role" | "name" | "email" | "phone";

export type AccessState =
  | { status: "idle" }
  | { status: "error"; message: string; field?: AccessField }
  | { status: "received"; email: string; role: AccessRole };

const RequestSchema = z.object({
  role: z.enum(ACCESS_ROLES, { message: "Choose how you'll use Afram." }),
  name: z.string().trim().min(2, "Please enter your full name.").max(120, "That name is too long."),
  email: z.email("Enter a valid email address.").max(200),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s()-]{7,20}$/, "Enter a valid phone number."),
});

const WIRE_ROLE: Record<AccessRole, RequestAccessInput["role"]> = {
  Member: "buyer",
  Vendor: "issuer",
  Financier: "financier",
};

export type ParsedAccessRequest =
  | { ok: true; role: AccessRole; email: string; input: RequestAccessInput }
  | { ok: false; state: AccessState };

export function isSpam(form: FormData): boolean {
  return Boolean(String(form.get("company") ?? "").trim());
}

export function parseAccessRequest(form: FormData): ParsedAccessRequest {
  const parsed = RequestSchema.safeParse({
    role: form.get("role"),
    name: form.get("name"),
    email: String(form.get("email") ?? "").trim(),
    phone: form.get("phone"),
  });

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      ok: false,
      state: {
        status: "error",
        message: issue?.message ?? "Please check your details.",
        field: issue?.path[0] as AccessField | undefined,
      },
    };
  }

  const { role, name, email, phone } = parsed.data;
  return {
    ok: true,
    role,
    email,
    input: { role: WIRE_ROLE[role], fullName: name, email, phone },
  };
}
