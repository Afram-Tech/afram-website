"use server";

import { graphqlFetch } from "@/graphql/client";
import { CONTACT_US } from "@/graphql/documents";

export interface ContactFormState {
  status: "idle" | "sent" | "error";
  /** Shown under the form when status is "error". */
  error?: string;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const field = (form: FormData, name: string) => String(form.get(name) ?? "").trim();

/**
 * Sends a "Talk to us" message through the API's contactUs mutation. Runs on
 * the server, so the GraphQL endpoint never has to be called from the
 * browser. The chosen topic becomes the subject line.
 */
export async function sendContactMessage(
  _previous: ContactFormState,
  form: FormData,
): Promise<ContactFormState> {
  // Spam trap: a field real visitors never see. Bots that fill it get a
  // quiet "sent" and nothing goes to the team.
  if (field(form, "company")) return { status: "sent" };

  const name = field(form, "name");
  const email = field(form, "email");
  const topic = field(form, "topic");
  const message = field(form, "message");

  if (!name || name.length > 120) return { status: "error", error: "Please enter your name." };
  if (!EMAIL.test(email) || email.length > 200) {
    return { status: "error", error: "Please enter a valid email address." };
  }
  if (!message || message.length > 5000) {
    return { status: "error", error: "Please write a message (up to 5,000 characters)." };
  }

  try {
    const data = await graphqlFetch<
      { contactUs: { success: boolean; message?: string | null } },
      { input: { name: string; email: string; subject?: string; message: string } }
    >(
      CONTACT_US,
      {
        input: {
          name,
          email,
          subject: topic ? `Website enquiry: ${topic.slice(0, 80)}` : "Website enquiry",
          message,
        },
      },
      { mutation: true },
    );
    if (!data.contactUs.success) throw new Error(data.contactUs.message ?? "not accepted");
    return { status: "sent" };
  } catch (error) {
    console.error("contactUs failed:", error instanceof Error ? error.message : error);
    return {
      status: "error",
      error: "We couldn’t send your message just now. Please try again in a moment.",
    };
  }
}
