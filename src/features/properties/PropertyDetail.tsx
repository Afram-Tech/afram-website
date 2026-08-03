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
  Share2,
  ShieldCheck,
  Star,
} from "lucide-react";
import Link from "next/link";

import { LockedSection } from "@/components/ui/LockedSection";
import { buttonVariants } from "@/components/ui/button-variants";
import { siteConfig } from "@/config/site";
import type { Property } from "@/features/landing/data/properties";
import { PropertyGallery } from "@/features/properties/PropertyGallery";
import { formatMoney, formatPropertySize, titleCase } from "@/lib/format";

const DEPOSIT_RATE = 0.1;
const ASSUMED_RATE = 0.12;

function Spec({ icon: Icon, label, value }: { icon: typeof Home; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="bg-brand-50 text-brand-600 flex h-9 w-9 items-center justify-center rounded-lg">
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <span className="flex flex-col">
        <span className="text-ink-400 text-[11px] tracking-wider uppercase">{label}</span>
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
    <div className="bg-ink-50/70 ring-ink-100 flex items-start gap-3 rounded-2xl p-4 ring-1">
      <span
        className={
          good
            ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"
            : "bg-brand-50 text-brand-600 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
        }
      >
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <span className="flex flex-col">
        <span className="text-ink-400 text-[11px] tracking-wider uppercase">{label}</span>
        <span className="text-ink-900 text-[14px] font-semibold">{value}</span>
      </span>
    </div>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-ink-900 text-[1.4rem] font-bold tracking-[-0.01em]">{children}</h2>;
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
            className="text-ink-500 hover:text-ink-900 inline-flex items-center gap-2 text-[14px] font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <p className="text-ink-400 hidden items-center gap-2 text-[13px] sm:flex">
            <Link href="/properties" className="hover:text-ink-700">
              Properties
            </Link>
            <span>›</span>
            <span className="text-ink-700">{property.name}</span>
          </p>
          <button className="text-ink-500 hover:text-ink-900 inline-flex items-center gap-2 text-[14px] font-medium transition-colors">
            <Share2 className="h-4 w-4" />
            Share
          </button>
        </div>

        {/* Title */}
        <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-ink-900 text-[clamp(1.8rem,3.4vw,2.5rem)] font-extrabold tracking-[-0.02em]">
              {property.name}
            </h1>
            <p className="text-ink-500 mt-2 inline-flex items-center gap-1.5 text-[15px]">
              <MapPin className="text-ink-400 h-4 w-4" />
              {property.location}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-[13px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {titleCase(property.status)}
          </span>
        </div>

        {/* Gallery — click any image for the spotlight */}
        <PropertyGallery images={property.images} title={property.name} />

        {/* Specs */}
        <div className="border-ink-100 mt-7 flex flex-wrap gap-x-6 gap-y-4 border-y py-5 sm:gap-x-10">
          <Spec icon={Home} label="Type" value={titleCase(property.type)} />
          <Spec icon={Bed} label="Bedrooms" value={String(property.beds)} />
          <Spec icon={Bath} label="Bathrooms" value={String(property.baths)} />
          <Spec icon={Maximize} label="Size" value={formatPropertySize(property.sqft)} />
        </div>

        {/* Listed by */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="bg-brand-700 flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-bold text-white">
              AF
            </span>
            <span className="flex flex-col">
              <span className="text-ink-400 text-[13px]">Listed on Afram</span>
              <span className="text-ink-900 text-[14px] font-semibold">{property.developer}</span>
            </span>
          </div>
          <span className="text-ink-900 inline-flex items-center gap-1.5 text-[14px] font-semibold">
            <Star className="fill-gold-400 text-gold-400 h-4 w-4" />
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
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
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
            </section>

            <section>
              <H2>Address</H2>
              <LockedSection label="the exact address">
                <div className="mt-4 space-y-3">
                  <div className="bg-ink-50/70 ring-ink-100 flex items-center gap-3 rounded-2xl p-4 ring-1">
                    <Navigation className="text-brand-500 h-5 w-5 shrink-0" />
                    <span className="flex min-w-0 flex-col">
                      <span className="text-ink-400 text-[11px] tracking-wider uppercase">
                        Street address
                      </span>
                      <span className="text-ink-900 truncate text-[14px] font-semibold">
                        {property.address.street}
                      </span>
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="bg-ink-50/70 ring-ink-100 flex items-center gap-3 rounded-2xl p-4 ring-1">
                      <Hash className="text-brand-500 h-5 w-5 shrink-0" />
                      <span className="flex min-w-0 flex-col">
                        <span className="text-ink-400 text-[11px] tracking-wider uppercase">
                          GPS address
                        </span>
                        <span className="tnum text-ink-900 truncate text-[14px] font-semibold">
                          {property.address.gps}
                        </span>
                      </span>
                    </div>
                    <div className="bg-ink-50/70 ring-ink-100 flex items-center gap-3 rounded-2xl p-4 ring-1">
                      <MapPin className="text-brand-500 h-5 w-5 shrink-0" />
                      <span className="flex min-w-0 flex-col">
                        <span className="text-ink-400 text-[11px] tracking-wider uppercase">
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
                <div className="ring-ink-100 mt-4 overflow-hidden rounded-2xl ring-1">
                  <table className="w-full text-left text-[14px]">
                    <thead>
                      <tr className="bg-ink-50/70 text-ink-400 text-[11px] tracking-wider uppercase">
                        <th className="px-4 py-3 font-semibold">Date</th>
                        <th className="px-4 py-3 font-semibold">Event</th>
                        <th className="px-4 py-3 text-right font-semibold">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-ink-100 divide-y">
                      {property.priceHistory.map((entry, i) => (
                        <tr key={i}>
                          <td className="text-ink-500 px-4 py-3">{entry.date}</td>
                          <td className="text-ink-700 px-4 py-3 font-medium">{entry.event}</td>
                          <td className="tnum text-ink-900 px-4 py-3 text-right font-semibold">
                            {formatMoney(entry.price, property.currency)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </LockedSection>
              <p className="text-ink-400 mt-3 text-[12px] leading-relaxed">
                Price changes are tracked by Afram to help you evaluate this listing over time.
              </p>
            </section>
          </div>

          {/* Sticky purchase card */}
          <aside className="lg:relative">
            <div className="lg:sticky lg:top-24">
              <div className="ring-ink-100 rounded-[1.5rem] bg-white p-6 shadow-[0_24px_70px_-30px_rgba(15,20,25,0.28)] ring-1">
                <p className="text-ink-400 text-[13px]">Starting from</p>
                <p className="tnum text-brand-500 mt-0.5 text-[2rem] font-extrabold tracking-[-0.02em]">
                  {formatMoney(property.price, property.currency)}
                </p>

                <div className="bg-brand-50 mt-4 rounded-2xl p-4">
                  <p className="text-brand-600 text-[11px] font-semibold tracking-wider uppercase">
                    10% deposit to reserve
                  </p>
                  <p className="tnum text-ink-900 mt-0.5 text-[1.25rem] font-bold">
                    {formatMoney(deposit, property.currency)}
                  </p>
                  <p className="text-ink-500 mt-1 text-[13px] leading-relaxed">
                    Refundable deposit held by Afram. Verified within 1–2 business days.
                  </p>
                </div>

                <div className="bg-ink-50/70 ring-ink-100 mt-3 flex items-center justify-between rounded-xl px-4 py-2.5 ring-1">
                  <span className="text-ink-500 text-[12px] font-medium">Amortization rate</span>
                  <span className="tnum text-ink-900 text-[13px] font-bold">
                    {(ASSUMED_RATE * 100).toFixed(0)}% p.a.
                  </span>
                </div>

                <Link
                  href={siteConfig.signUpUrl}
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
                      <p key={i} className="text-ink-700 flex items-center gap-2.5 text-[14px]">
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
