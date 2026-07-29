import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: `How ${siteConfig.legalName} collects, uses, and protects your data.`,
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-ink-900 text-[clamp(1.8rem,3vw,2.25rem)] font-bold tracking-[-0.02em]">
          Privacy Policy
        </h1>
        <p className="text-ink-500 mt-4">
          {siteConfig.legalName} (&quot;Afram&quot;, &quot;we&quot;, &quot;us&quot;) is committed to
          protecting your privacy. This page outlines how we collect, use, and safeguard information
          when you use our marketplace.
        </p>
        <p className="text-ink-400 mt-4 text-sm">
          This is placeholder content. Replace with your full privacy policy, terms of service, and
          cookie policy before launch.
        </p>
      </div>
    </section>
  );
}
