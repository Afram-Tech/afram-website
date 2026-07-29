import type { Metadata } from "next";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button-variants";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Log In",
  description: "Log in to your Afram account.",
  path: "/signin",
});

export default function SignInPage() {
  return (
    <section className="flex flex-1 items-center justify-center py-24">
      <div className="mx-auto max-w-md px-4 text-center sm:px-6 lg:px-8">
        <h1 className="text-ink-900 text-2xl font-bold tracking-[-0.02em]">Log in to Afram</h1>
        <p className="text-ink-500 mt-3">
          Don&apos;t have an account yet?{" "}
          <Link href="/signup" className="text-brand-600 font-medium">
            Create one
          </Link>
          .
        </p>
        <div className="mt-8">
          <Link href="/" className={buttonVariants("primary")}>
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
