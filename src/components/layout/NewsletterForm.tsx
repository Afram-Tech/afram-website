import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui/Button";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitted">("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitted");
  }

  if (status === "submitted") {
    return <p className="text-ink-300 text-sm">Thanks — you&apos;re on the list.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-sm gap-2">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@email.com"
        className="border-ink-700 placeholder:text-ink-400 focus:ring-brand-400 w-full rounded-full border bg-transparent px-4 py-2 text-sm text-white focus:ring-2 focus:outline-none"
      />
      <Button type="submit" className="shrink-0">
        Subscribe
      </Button>
    </form>
  );
}

export default NewsletterForm;
