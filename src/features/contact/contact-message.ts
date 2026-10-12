import type { ContactUsInput } from "@/types/generated/graphql";

export interface ContactFormState {
  status: "idle" | "sent" | "error";
  error?: string;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const field = (form: FormData, name: string) => String(form.get(name) ?? "").trim();

export function isSpam(form: FormData): boolean {
  return Boolean(field(form, "company"));
}

export function parseContactMessage(
  form: FormData,
): { ok: true; input: ContactUsInput } | { ok: false; error: string } {
  const name = field(form, "name");
  const email = field(form, "email");
  const topic = field(form, "topic");
  const message = field(form, "message");
  const phone = field(form, "phone");

  if (!name || name.length > 120) return { ok: false, error: "Please enter your name." };
  if (!EMAIL.test(email) || email.length > 200) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (message.length > 5000) {
    return { ok: false, error: "Please keep your message under 5,000 characters." };
  }
  if (phone.length > 40) return { ok: false, error: "That phone number is too long." };

  return {
    ok: true,
    input: {
      name,
      email,
      subject: topic ? `Website enquiry: ${topic.slice(0, 80)}` : "Website enquiry",
      message: [message || "(No message)", phone ? `\nPhone: ${phone}` : ""].join(""),
    },
  };
}
