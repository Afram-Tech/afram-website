# How the affordability calculator works

This is the slider on the landing page — someone drags it to their monthly
take-home pay and gets back a rough home price, a 20% deposit, a monthly
payment, and a strip of real listings near that budget. It's spread across
four files now, so here's how they fit together and why I split it that way.

## The four files

- [`affordability.ts`](../src/features/landing/affordability.ts) — no
  React in it at all. Just the four mortgage assumptions, the math
  functions built on them, and the property-matching algorithm. Both the
  server and client pieces below import from here, so there's exactly one
  place the numbers live.
- [`sections/AffordabilityCalculatorSection.tsx`](../src/features/landing/sections/AffordabilityCalculatorSection.tsx) —
  a server component. It fetches Afram's live property list, works out the
  cheapest one, and hands the client component a starting income plus the
  full list to recommend from.
- [`AffordabilityCalculator.tsx`](../src/features/landing/AffordabilityCalculator.tsx) —
  the client component. This is the interactive part: the slider, the three
  stat tiles, and the recommendation strip underneath them.
- [`PropertyCardCompact.tsx`](../src/features/landing/PropertyCardCompact.tsx) —
  a smaller cousin of `PropertyCard`, sized for a horizontal strip instead
  of a grid.

I split it this way because the calculator used to be entirely
self-contained client state with no data behind it. The moment it needed to
know about real listings, something had to fetch them, and only a server
component can do that — but the slider itself still has to be interactive,
which only a client component can do. `affordability.ts` is what keeps
those two sides honest with each other: the server component uses it to
work out a starting income, the client component uses the same functions to
turn that income into a price, so neither side can drift out of sync with
the other's assumptions.

## What it's actually doing

You move the slider, it assumes you'd comfortably put 30% of that toward a
mortgage payment, and then works backwards: "at 14% interest over 10 years,
what loan does that monthly payment pay off?" Then, since that loan is
assumed to be an 80% loan-to-value mortgage, it grosses the loan back up to
a full home price (`loan / 0.8`), and the deposit is just the other 20% of
that price. Nothing about it is a real quote, which is why there's a
disclaimer under the numbers — it's meant to give someone a plausible
ballpark before they actually talk to anyone, not to promise terms.

Underneath that, the recommendation strip takes whatever price the slider
lands on and shows real Afram listings closest to it — so the number isn't
just abstract, it's backed by things someone could actually go look at.

## The five numbers that drive everything

```ts
const ANNUAL_RATE = 0.14; // 14% annual interest
const TENOR_MONTHS = 10 * 12; // 10-year loan
const LTV = 0.8; // financier covers 80% of the property value
const PAYMENT_TO_INCOME = 0.3; // "comfortable" payment = 30% of take-home
const EXCHANGE_RATE = 12; // GHS per USD, for comparing listings in different currencies
```

The first four aren't arbitrary — they come directly from Afram's mortgage
amortisation model. I derived the 30% from the sample schedule: a GHS
386,400 loan at 14%, paid off at GHS 5,999.50/month, against a stated
household income of GHS 19,998.32. Divide those two and you get exactly
30%. The exchange rate is separate from the mortgage model — it exists only
because listings on the marketplace are priced in whatever currency the
seller used (mostly USD), and the calculator itself only ever thinks in
GHS, so something has to make those two comparable before sorting or
matching happens.

All five live in `affordability.ts`, not inline in a component, for the
same reason as before: if the real terms change — a different rate, a
different LTV band, a different affordability threshold, a different
GHS/USD rate — you should only need to touch these five lines, and every
number on the page follows automatically, in both the starting value and
everything the slider computes afterward.

## The core math

`affordableLoan(monthly, annualRate, months)` is the standard loan annuity
formula, solved for principal instead of payment:

```
i = annualRate / 12                     // monthly interest rate
loan = monthly * (1 - (1 + i)^-months) / i
```

In plain terms: "given someone can pay this much a month, how big a loan
does that fully pay off over this many months at this rate?" This is what
`incomeToSnapshot()` uses to turn the slider's income into the price,
deposit, and monthly figures shown in the three stat tiles.

`paymentForLoan(loan, annualRate, months)` is the exact inverse — same
formula solved for the monthly payment instead of the loan:

```
monthly = loan * i / (1 - (1 + i)^-months)
```

This is what `priceToIncome()` uses to go the other direction: given a home
price (the cheapest listing on the platform, at startup), what monthly
income would someone need for that price to be "comfortable" under the same
30%-of-income assumption? That's how the slider's starting position gets
set — not a hardcoded number, but a real answer to "what's the lowest
income that can afford anything on Afram right now?"

## How the server component sets the starting point

`AffordabilityCalculatorSection.tsx` calls `getAllProperties()` — the same
function `FeaturedPropertiesSection` and `MorePropertiesSection` already
use, deduped per request so this doesn't cost an extra fetch — then:

1. Drops anything without a price or an image.
2. Converts every price to GHS with `toGhs()`, and sorts the list ascending
   by that converted price. This sorted list is what makes the
   recommendation matching below cheap to run.
3. Takes the cheapest one and runs it through `priceToIncome()`, then
   `clampToStep()` rounds that to the nearest slider step and keeps it
   inside the slider's min/max.
4. Passes that starting income and the whole sorted list down as props to
   the client component. If the property fetch comes back empty (the API
   can legitimately return nothing), it falls back to a plain default
   income and no recommendation strip renders at all.

## How the recommendation strip picks properties

Every time the slider moves, `AffordabilityCalculator.tsx` needs "the
properties closest to this price" out of a list that can run into the
hundreds. There's no server endpoint that can filter by price for us (the
GraphQL API only takes an offset/limit), and re-fetching on every drag of a
range slider would be laggy anyway, so this works entirely off the list
already sent down by the server component. Re-filtering or re-sorting that
whole list on every drag would still work, but it's wasted effort when the
list is already sorted — so `nearestByPrice()` in `affordability.ts`
binary-searches for where the slider's price would sit in that sorted list
(`O(log n)` instead of `O(n)`), then walks outward from that point,
alternating one step below and one step above, until it has enough
properties or runs outside `RECOMMENDATION_BAND` (a `±40%` window around
the target, set in `AffordabilityCalculator.tsx`) — whichever comes first.

That band is deliberate: if nothing on the platform is actually close to
what someone can afford, showing the six cheapest properties anyway would
be misleading, so `nearestByPrice()` returns an empty list instead, and the
whole "Properties near this budget" block just doesn't render. Drag the
slider down toward GHS 2,000 and you'll see this happen — nothing on Afram
is anywhere near that budget today, so the strip disappears entirely rather
than padding itself out with properties several times over budget.

## Formatting

Money on the calculator itself uses the helpers in
[`src/lib/format.ts`](../src/lib/format.ts): `ghs()` for the exact figures
(take-home, monthly payment), and `ghsCompact()` for the price and deposit,
which round down to a `k`/`M` suffix so a six-digit number doesn't overflow
the tile. The recommendation cards are the one place that shows a listing's
_original_ currency (via `formatMoney()`) rather than a GHS conversion —
the GHS number only exists internally, for sorting and matching, and isn't
meant to look like a real converted price on a card someone might screenshot.

## If you need to touch this later

- **Rate, tenor, LTV, income ratio, or the exchange rate changed?** Edit
  the constants at the top of `affordability.ts` — nothing else. The
  disclaimer text under the tiles is hand-written, not generated from those
  constants, so update it too if the mortgage numbers move.
- **Want a different slider range or step size?** `INCOME_MIN`,
  `INCOME_MAX`, and `INCOME_STEP` are also in `affordability.ts` now,
  shared between the slider's own `min`/`max`/`step` props and the
  `clampToStep()` call that sets the starting income — change them there,
  not in the JSX.
- **Want more or fewer recommendation cards, or a wider/narrower "near this
  budget" window?** `RECOMMENDATION_COUNT` and `RECOMMENDATION_BAND` are
  both at the top of `AffordabilityCalculator.tsx`.
- **Something looks off in the recommendation strip?** Before assuming it's
  a bug, check how many listings actually exist near that price — with a
  small or lopsided dataset (e.g. only one listing below a given budget),
  `nearestByPrice()` can legitimately return nearly the same set for two
  different slider positions, because there's nothing closer to fill in
  with. And if the slider is somewhere no listing is within
  `RECOMMENDATION_BAND` of, an empty strip is the intended behaviour, not a
  fetch failure.
