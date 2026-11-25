import {
  ClipboardCheck,
  FileSearch,
  Home,
  Landmark,
  Scale,
  Wallet,
} from "lucide-react";
import { StoryBand, type StoryPoint } from "@/components/persona/StoryBand";

/**
 * The two kinds of loan, each in the band the vendors page sells with. They
 * replaced one container with two small cards ("Finance the build, or
 * finance the buyer.").
 *
 * Every point restates this page's own "Afram does / You do" checklist
 * (where-our-job-ends.tsx) or its pricing section. Afram verifies the asset,
 * never the borrower: keep borrower checks on the lender's side.
 */
const BUILD: StoryPoint[] = [
  {
    icon: FileSearch,
    title: "Title verified first",
    body: "Checked against Lands Commission records, with litigation and caveats searched.",
  },
  {
    icon: ClipboardCheck,
    title: "Permit and site plan checked",
    body: "The building permit and surveyor-signed site plan are checked before a project reaches you.",
  },
  {
    icon: Landmark,
    title: "Escrow and charge structured",
    body: "Afram structures the escrow and the charge. You hold the first legal charge.",
  },
];

const BUY: StoryPoint[] = [
  {
    icon: Home,
    title: "Completed, verified homes",
    body: "Finance a buyer’s purchase of a finished home with a verified title.",
  },
  {
    icon: Scale,
    title: "The credit decision stays yours",
    body: "You receive the buyer’s details direct, run your own checks, and approve or decline.",
  },
  {
    icon: Wallet,
    title: "Repayments tracked",
    body: "Every repayment is tracked on the platform.",
  },
];

const BRIEFING = { label: "Request a briefing", href: "#briefing" };

export function LendingBands() {
  return (
    <>
      <StoryBand
        id="build"
        title="Lend to developers to build or finish a phase."
        lead="Verified projects, repaid from unit sales."
        cta={BRIEFING}
        points={BUILD}
      />
      <StoryBand
        id="buy"
        title="Lend to buyers of verified homes."
        lead="Often the same asset you funded during construction."
        cta={BRIEFING}
        points={BUY}
        reverse
      />
    </>
  );
}
