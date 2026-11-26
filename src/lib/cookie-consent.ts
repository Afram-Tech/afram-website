/**
 * Cookie consent, as the Cookie Policy promises: on a first visit people can
 * accept or reject non-essential cookies, and change their mind later
 * ("Cookie settings" in the footer). Essential cookies are always on; the
 * choice itself is stored in one, `afram_cookie_consent`, for a year.
 *
 * Anything that would set a non-essential cookie (analytics, ads) must check
 * `hasConsent(category)` first — see lib/track.ts. The Exchange carries the
 * same rules (src/app/components/legal/cookieConsent.ts there).
 */

export type CookieCategory = "functional" | "performance" | "analytics" | "advertising";

export type CookieChoices = Record<CookieCategory, boolean>;

export interface CookieConsent {
  v: 1;
  /** When the choice was made, ISO. */
  at: string;
  choices: CookieChoices;
}

export const COOKIE_CATEGORIES: { id: CookieCategory | "essential"; label: string; body: string }[] = [
  { id: "essential", label: "Essential", body: "Keep you signed in and transactions secure. Always on." },
  { id: "functional", label: "Functional", body: "Remember your preferences, such as language." },
  { id: "performance", label: "Performance", body: "Page load times and errors, so we can fix what's slow." },
  { id: "analytics", label: "Analytics", body: "How people use Afram, so we can improve it." },
  { id: "advertising", label: "Advertising", body: "Show ads that may be relevant to you and measure campaigns." },
];

export const ALL_ON: CookieChoices = { functional: true, performance: true, analytics: true, advertising: true };
export const ALL_OFF: CookieChoices = { functional: false, performance: false, analytics: false, advertising: false };

const NAME = "afram_cookie_consent";
const YEAR = 60 * 60 * 24 * 365;
const OPEN_EVENT = "afram:cookie-settings";

export function parseConsent(raw: string | null | undefined): CookieConsent | null {
  if (!raw) return null;
  try {
    const c = JSON.parse(decodeURIComponent(raw)) as Partial<CookieConsent>;
    if (c.v !== 1 || typeof c.at !== "string" || !c.choices) return null;
    return { v: 1, at: c.at, choices: { ...ALL_OFF, ...pickBooleans(c.choices) } };
  } catch {
    return null;
  }
}

function pickBooleans(o: Partial<CookieChoices>): Partial<CookieChoices> {
  const out: Partial<CookieChoices> = {};
  for (const k of Object.keys(ALL_OFF) as CookieCategory[]) if (typeof o[k] === "boolean") out[k] = o[k];
  return out;
}

export function readConsent(): CookieConsent | null {
  if (typeof document === "undefined") return null;
  const hit = document.cookie.split("; ").find((c) => c.startsWith(`${NAME}=`));
  return parseConsent(hit?.slice(NAME.length + 1));
}

export function saveConsent(choices: CookieChoices): CookieConsent {
  const consent: CookieConsent = { v: 1, at: new Date().toISOString(), choices };
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${NAME}=${encodeURIComponent(JSON.stringify(consent))}; Max-Age=${YEAR}; Path=/; SameSite=Lax${secure}`;
  return consent;
}

/** Non-essential categories are off until someone says yes. */
export function hasConsent(category: CookieCategory): boolean {
  return readConsent()?.choices[category] ?? false;
}

/** Reopen the cookie choices, e.g. from "Cookie settings" in the footer. */
export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function onOpenCookieSettings(fn: () => void): () => void {
  window.addEventListener(OPEN_EVENT, fn);
  return () => window.removeEventListener(OPEN_EVENT, fn);
}
