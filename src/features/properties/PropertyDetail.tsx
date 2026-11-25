import {
  ArrowLeft,
  BadgeCheck,
  Bath,
  Bed,
  CalendarDays,
  Check,
  CheckCircle2,
  FileText,
  Hash,
  Home,
  Map,
  MapPin,
  Maximize,
  Navigation,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

import { LockedSection } from "@/components/ui/LockedSection";
import { SecBadge } from "@/components/ui/SecBadge";
import { buttonVariants } from "@/components/ui/button-variants";
import { siteConfig } from "@/config/site";
import type { Property } from "@/features/landing/data/properties";
import { PropertyGallery } from "@/features/properties/PropertyGallery";
import { ShareButton } from "@/features/properties/ShareButton";
import { formatMoney, formatPropertySize, titleCase } from "@/lib/format";
import { locationName, locationPath, locationTrail } from "@/lib/property-seo";
import { bathsLabel } from "@/features/properties/listing-display";
import { cn } from "@/lib/utils";

const DEPOSIT_RATE = 0.1;
const ASSUMED_RATE = 0.12;

/** Status pill tones, by the API's status. */
const STATUS_TONE: Record<string, string> = {
  available: "bg-success-lighter text-success-darker",
  listed: "bg-success-lighter text-success-darker",
  under_offer: "bg-away-lighter text-away-darker",
  pending: "bg-away-lighter text-away-darker",
  sold: "bg-ink-50 text-ink-600",
};

function Spec({ icon: Icon, label, value }: { icon: typeof Home; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="bg-brand-50 text-brand-500 flex h-9 w-9 items-center justify-center rounded-[10px]">
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <span className="flex flex-col">
        <span className="text-ink-400 text-[12px] font-medium">{label}</span>
        <span className="tnum text-ink-900 text-[15px] font-semibold">{value}</span>
      </span>
    </div>
  );
}

function LegalCard({
  icon: Icon,
  label,
  value,
  good,
}: {
  icon: typeof FileText;
  label: string;
  value: string;
  good?: boolean;
}) {
  return (
    <div className="bg-ink-50 flex items-start gap-3 rounded-2xl p-4">
      <span
        className={
          good
            ? "text-success-darker flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-white"
            : "bg-brand-50 text-brand-500 flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
        }
      >
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <span className="flex flex-col">
        <span className="text-ink-400 text-[12px] font-medium">{label}</span>
        <span className="tnum text-ink-900 text-[14px] font-semibold">{value}</span>
      </span>
    </div>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="t-h3 text-ink-900">{children}</h2>;
}

export function PropertyDetail({ property }: { property: Property }) {
  const deposit = Math.round(property.price * DEPOSIT_RATE);

  return (
    <div className="bg-white px-5 py-8 lg:px-[34px] lg:py-10">
      <div className="mx-auto max-w-[1180px]">
        {/* Top bar */}
        <div className="border-ink-100 flex items-center justify-between gap-4 border-b pb-5">
          <Link
            href="/properties"
            className="text-ink-500 hover:text-ink-900 inline-flex items-center gap-1.5 text-[14px] font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            All properties
          </Link>
          <nav
            aria-label="Breadcrumb"
            className="text-ink-400 hidden min-w-0 items-center gap-2 text-[13px] sm:flex"
          >
            <Link href="/properties" className="hover:text-ink-700">
              Properties
            </Link>
            {locationTrail(property).map((node) => (
              <span key={node.id} className="contents">
                <span>›</span>
                <Link href={locationPath(node)} className="hover:text-ink-700 truncate">
                  {locationName(node)}
                </Link>
              </span>
            ))}
            <span>›</span>
            <span className="text-ink-700 truncate">{property.name}</span>
          </nav>
          <ShareButton title={property.name} />
        </div>

        {/* Title */}
        <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <SecBadge className="mb-4" />
            <h1 className="t-h1-sm text-ink-900">
              {property.name}
            </h1>
            <p className="text-ink-500 mt-2 inline-flex items-center gap-1.5 text-[15px]">
              <MapPin className="text-ink-400 h-4 w-4" />
              {property.location}
            </p>
          </div>
          <span
            className={cn(
              "inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium",
              STATUS_TONE[property.status.toLowerCase()] ?? STATUS_TONE.available,
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {titleCase(property.status)}
          </span>
        </div>

        {/* Gallery — click any image for the spotlight */}
        <PropertyGallery images={property.images} title={property.name} />

        {/* Specs */}
        <div className="border-ink-100 mt-7 flex flex-wrap gap-x-6 gap-y-4 border-y py-5 sm:gap-x-10">
          <Spec icon={Home} label="Type" value={titleCase(property.type)} />
          <Spec icon={Bed} label="Bedrooms" value={String(property.beds)} />
          <Spec icon={Bath} label="Bathrooms" value={bathsLabel(property)} />
          <Spec icon={Maximize} label="Size" value={formatPropertySize(property.sqft)} />
        </div>

        {/* Listed by */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="bg-brand-50 text-brand-500 flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-bold">
              AF
            </span>
            <span className="flex flex-col">
              <span className="text-ink-400 text-[13px]">Listed on Afram</span>
              <span className="text-ink-900 text-[14px] font-semibold">{property.developer}</span>
            </span>
          </div>
          <span className="text-ink-900 inline-flex items-center gap-1.5 text-[14px] font-semibold">
            <BadgeCheck className="text-brand-500 h-4 w-4" />
            Verified Developer
          </span>
        </div>

        {/* Body */}
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_340px]">
          {/* Left content */}
          <div className="min-w-0 space-y-8 sm:space-y-10 lg:space-y-12">
            <section>
              <H2>About this property</H2>
              <p className="text-ink-500 mt-3 max-w-xl text-[15px] leading-relaxed">
                {property.about}
              </p>
            </section>

            <section>
              <H2>Amenities</H2>
              <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                {property.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="text-ink-700 flex items-center gap-2.5 text-[15px]"
                  >
                    <span className="bg-brand-50 text-brand-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    {amenity}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <H2>Legal &amp; Title</H2>
              {/* The title number is public, so a buyer can check it against
                  the Lands Commission before signing up; the rest of the
                  record is for signed-in members, like the address and price
                  history. */}
              <div className="mt-4">
                <LegalCard
                  icon={Hash}
                  label="Land title number"
                  value={property.legal.landCertificate || "Available on request"}
                />
              </div>
              <div className="mt-3">
                <LockedSection label="the full title record">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <LegalCard icon={FileText} label="Title type" value={property.legal.titleType} />
                    <LegalCard
                      icon={Map}
                      label="Land certificate"
                      value={property.legal.landCertificate}
                    />
                    <LegalCard
                      icon={CheckCircle2}
                      label="Listing status"
                      value={property.legal.listingStatus}
                      good
                    />
                    <LegalCard
                      icon={ShieldCheck}
                      label="Verification"
                      value={property.legal.verification}
                    />
                  </div>
                </LockedSection>
              </div>
            </section>

            <section>
              <H2>Address</H2>
              <LockedSection label="the exact address">
                <div className="mt-4 space-y-3">
                  <div className="bg-ink-50 flex items-center gap-3 rounded-2xl p-4">
                    <Navigation className="text-brand-500 h-5 w-5 shrink-0" />
                    <span className="flex min-w-0 flex-col">
                      <span className="text-ink-400 text-[12px] font-medium">
                        Street address
                      </span>
                      <span className="text-ink-900 truncate text-[14px] font-semibold">
                        {property.address.street}
                      </span>
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="bg-ink-50 flex items-center gap-3 rounded-2xl p-4">
                      <Hash className="text-brand-500 h-5 w-5 shrink-0" />
                      <span className="flex min-w-0 flex-col">
                        <span className="text-ink-400 text-[12px] font-medium">
                          GPS address
                        </span>
                        <span className="tnum text-ink-900 truncate text-[14px] font-semibold">
                          {property.address.gps}
                        </span>
                      </span>
                    </div>
                    <div className="bg-ink-50 flex items-center gap-3 rounded-2xl p-4">
                      <MapPin className="text-brand-500 h-5 w-5 shrink-0" />
                      <span className="flex min-w-0 flex-col">
                        <span className="text-ink-400 text-[12px] font-medium">
                          Property ID
                        </span>
                        <span className="tnum text-ink-900 truncate text-[14px] font-semibold">
                          {property.address.propertyId}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="ring-ink-100 overflow-hidden rounded-2xl ring-1">
                    <iframe
                      title={`Map of ${property.location}`}
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(
                        property.location,
                      )}&z=13&output=embed`}
                      className="block h-[300px] w-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
              </LockedSection>
            </section>

            <section>
              <H2>Price history</H2>
              <LockedSection label="price history">
                <div className="ring-ink-100 mt-4 min-h-[25dvh] overflow-hidden rounded-2xl ring-1">
                  <table className="w-full text-left text-[14px]">
                    <thead className="bg-ink-50/70 text-ink-400 text-[12px] font-medium">
                      <tr>
                        <th className="px-5 py-3 font-medium">Date</th>
                        <th className="px-5 py-3 font-medium">Activity</th>
                        <th className="px-5 py-3 text-right font-medium">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-ink-100 divide-y">
                      {property.priceHistory.map((entry, i) => (
                        <tr key={i}>
                          <td className="tnum text-ink-700 px-5 py-3.5">{entry.date}</td>
                          <td className="text-ink-700 px-5 py-3.5">{entry.event}</td>
                          <td className="tnum text-ink-900 px-5 py-3.5 text-right font-semibold">
                            {formatMoney(entry.price, property.currency)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-ink-400 mt-3 text-[13px]">
                  Price history recorded on-chain via Polygon. All figures in {property.currency}.
                </p>
              </LockedSection>
            </section>
          </div>

          {/* Sticky purchase card */}
          <aside className="lg:relative">
            <div className="lg:sticky lg:top-24">
              <div className="shadow-raised ring-ink-100 rounded-3xl bg-white p-6 ring-1">
                <p className="text-ink-400 text-[13px]">Starting from</p>
                <p className="tnum text-ink-900 mt-0.5 text-[1.75rem] font-semibold tracking-[calc(-0.02em*var(--tracking-scale,1))]">
                  {formatMoney(property.price, property.currency)}
                </p>

                <div className="bg-brand-50 mt-4 rounded-2xl p-4">
                  <p className="text-brand-500 text-[12px] font-semibold">
                    10% deposit to reserve
                  </p>
                  <p className="tnum text-ink-900 mt-0.5 text-[1.25rem] font-bold">
                    {formatMoney(deposit, property.currency)}
                  </p>
                  <p className="text-ink-500 mt-1 text-[13px] leading-relaxed">
                    Refundable deposit held by Afram. Verified within 1–2 business days.
                  </p>
                </div>

                <div className="bg-ink-50 mt-3 flex items-center justify-between rounded-xl px-4 py-2.5">
                  <span className="text-ink-500 text-[12px] font-medium">Amortisation rate</span>
                  <span className="tnum text-ink-900 text-[13px] font-bold">
                    {(ASSUMED_RATE * 100).toFixed(0)}% p.a.
                  </span>
                </div>

                <Link
                  href={`${siteConfig.appUrl!}/buyer/browse/property/${property.id}?modal=express-interest`}
                  className={buttonVariants("primary", "lg", "mt-5 w-full")}
                >
                  Express Interest
                </Link>

                <div className="border-ink-100 mt-5 space-y-3 border-t pt-5">
                  {[
                    [BadgeCheck, "Afram-verified listing"],
                    [Check, "Master title deed on file"],
                    [CalendarDays, "Flexible payment schedules"],
                  ].map(([Icon, label], i) => {
                    const IconComponent = Icon as typeof Check;
                    return (
                      <p key={i} className="text-ink-600 flex items-center gap-2.5 text-[14px]">
                        <IconComponent className="text-brand-500 h-[18px] w-[18px]" />
                        {label as string}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
