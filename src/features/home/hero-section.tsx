import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="flex flex-col items-center gap-6 px-6 py-32 text-center">
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
        Afram Website
      </h1>
      <p className="max-w-xl text-lg text-slate-600">
        Built with Next.js, TypeScript, and Tailwind CSS.
      </p>
      <Button>Get started</Button>
    </section>
  );
}
