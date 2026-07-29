import type { Metadata } from "next";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button-variants";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Create Account",
  description:
    "Create an Afram account to browse verified properties, list a project, or deploy capital.",
  path: "/signup",
});

export default function SignUpPage() {
  return (
    <section className="flex flex-1 items-center justify-center py-24">
      <div className="mx-auto max-w-md px-4 text-center sm:px-6 lg:px-8">
        <h1 className="text-ink-900 text-2xl font-bold tracking-[-0.02em]">Create your account</h1>
        <p className="text-ink-500 mt-3">
          Account creation is available on the Afram platform. Continue to sign up as a buyer,
          vendor, or financier.
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
