# How the affordability calculator works

This is the slider on the landing page — someone drags it to their monthly
take-home pay and gets back a rough home price, a 20% deposit, and a monthly
payment. The whole thing lives in one file:
[`AffordabilityCalculatorSection.tsx`](../src/features/landing/sections/AffordabilityCalculatorSection.tsx).

First thing worth knowing: it's not talking to anything. No API, no
marketplace data, no mortgage backend. It's just arithmetic that runs in the
browser off four numbers I hardcoded at the top of the file. I'm writing this
down mostly so that when the real mortgage terms change, whoever's touching
this file doesn't have to reverse-engineer the math to know what's safe to
edit.

## What it's actually doing

You move the slider, it assumes you'd comfortably put 30% of that toward a
mortgage payment, and then works backwards: "at 14% interest over 10 years,
what loan does that monthly payment pay off?" Then, since that loan is
assumed to be an 80% loan-to-value mortgage, it grosses the loan back up to a
full home price (`loan / 0.8`), and the deposit is just the other 20% of
that price.

So it's really one calculation (loan size from a monthly payment) plus two
divisions to turn that loan into a price and a deposit. Nothing about it is
a real quote, which is why there's a disclaimer under the numbers — it's
meant to give someone a plausible ballpark before they actually talk to
anyone, not to promise terms.

## The four numbers that drive everything

```ts
const ANNUAL_RATE = 0.14; // 14% annual interest
const TENOR_MONTHS = 10 * 12; // 10-year loan
const LTV = 0.8; // financier covers 80% of the property value
const PAYMENT_TO_INCOME = 0.3; // "comfortable" payment = 30% of take-home
```

These aren't arbitrary — they come directly from Afram's mortgage
amortisation model. I derived the 30% from the sample schedule: a GHS
386,400 loan at 14%, paid off at GHS 5,999.50/month, against a stated
household income of GHS 19,998.32. Divide those two and you get exactly 30%.

The reason I pulled these out as named constants instead of leaving them
inline is that if the real terms ever change — different rate, different LTV
band, different affordability threshold — you should only need to touch
these four lines. Everything downstream follows automatically. If you find
yourself editing the math further down to change a rate or a ratio, that's a
sign something's wrong — it shouldn't be necessary.

## The actual math

`affordableLoan(monthly, annualRate, months)` is just the standard loan
annuity formula, flipped around to solve for principal instead of payment:

```
i = annualRate / 12                     // monthly interest rate
loan = monthly * (1 - (1 + i)^-months) / i
```

In plain terms: "given someone can pay this much a month, how big a loan
does that fully pay off over this many months at this rate?" It's the same
relationship a bank uses in reverse to turn a loan amount into a monthly
payment on an amortisation schedule — here it's solved for the other
variable.

From there, the component (in a `useMemo` keyed on `income`) does four
things every time the slider moves:

1. `monthly = income * PAYMENT_TO_INCOME` — what we're assuming is a
   comfortable payment.
2. `loan = affordableLoan(monthly, ANNUAL_RATE, TENOR_MONTHS)` — the loan
   that payment can sustain.
3. `price = loan / LTV`, rounded to the nearest GHS 1,000 — since we assumed
   the loan is 80% of the home's value, dividing by 0.8 gets us back to the
   full price.
4. `deposit = price * (1 - LTV)`, rounded to the nearest GHS 1,000 — the 20%
   the buyer would need to bring themselves.

Those three values (`price`, `deposit`, `monthly`) are what land in the
three stat tiles on screen.

## Formatting

I reused the money helpers already in [`src/lib/format.ts`](../src/lib/format.ts)
rather than writing new ones: `ghs()` for the exact figures (take-home,
monthly payment — things like `GHS 8,000`), and `ghsCompact()` for the price
and deposit, which round down to a `k`/`M` suffix (`GHS 193k`) so a
six-digit number doesn't overflow the tile.

## If you need to touch this later

- **Rate, tenor, LTV, or the income ratio changed?** Just edit the four
  constants at the top. One thing that won't update itself: the disclaimer
  text under the tiles is hand-written, not generated from those constants,
  so go update it too if the numbers move.
- **Want a different slider range or step size?** That's unrelated to the
  math — just the `min`/`max`/`step` props on the `<input type="range">`.
- **Thinking about wiring this to a real listing instead of a generic
  estimate?** That's more than a tweak — right now it never touches the
  marketplace API or Sanity, it's pure arithmetic on the slider value.
  Making it listing-aware would be a new feature, not an edit to this file.
