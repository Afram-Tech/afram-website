# What you can edit with the CMS — and what you can't

This is the plain-language version of the story. If you want the engineering
reasoning behind _why_ Sanity was chosen over other options, read
[`sanity-cms.md`](./sanity-cms.md) and [`keystatic-cms.md`](./keystatic-cms.md)
first — this document picks up from "we built it," not "should we build it."

## The one-paragraph version

Afram has two separate pieces of software: `afram-dashboard`, the internal
admin tool staff log into, and `afram-website`, the actual public site
visitors see at afram.co. Inside `afram-dashboard`, at `/dashboard/cms`,
there's a real content editor — **Sanity Studio**. When someone edits a
headline there and hits save, it's stored in Sanity's own hosted database
(Sanity calls it the "Content Lake"). `afram-website` then asks that same
database, every time someone loads a page, "what's the current homepage
headline?" and shows whatever the answer is. Nobody edits code to change a
sentence. Nobody redeploys the site. It's the same relationship as a WordPress
admin panel and the WordPress site it powers — just with a nicer editor and a
faster database.

That's the whole idea. The rest of this document is about _where the line
sits_ — what's genuinely inside that system today, what's designed but not
built, and what was never going to be in there in the first place, on
purpose.

## Three different kinds of "stuff on the website" — only one of them is CMS content

Everything a visitor sees on afram.co falls into one of three buckets, and
they're handled in three completely different ways. This is the part worth
understanding before anything else, because it answers the "can we edit
_everything_, including the design?" question directly.

**1. Marketing copy — this is what the CMS manages.**
Headlines, button labels, the paragraph under a heading, which image sits in
the hero banner, the order of items in the footer. This is text and images
that a person writes once and occasionally revises — exactly the kind of
thing a non-engineer should be able to change without asking an engineer to
touch a file. This is Sanity's whole job.

**2. Live marketplace data — this is not CMS content, and never will be.**
Property listings, prices, square footage, who owns what, transaction
history, user accounts. This data is created by real people doing real things
on the platform, it changes by the minute, and it has to be fast, accurate,
and consistent with everything else in the business (the same property can't
show a different price on the website than it does in the dashboard). That's
what the GraphQL API and the underlying database are for, and it's a
completely separate system from Sanity. The featured-properties carousel on
the homepage, for example, has some CMS-editable copy around it ("Featured
properties", "Browse verified properties…", the "See more" button) — but the
actual property cards inside it are always live data from the marketplace,
never something typed into Sanity.

**3. Design — this is not CMS content either, and this is the deliberate
part.**
By "design" we mean things like: how wide the page is, what font is used,
how much space sits between two elements, what shade of teal the buttons are,
whether a section is a 2-column grid or a 3-column grid, how a card animates
in. This lives in code (`.tsx` files and Tailwind CSS classes), not in
Sanity, and that's intentional, not a gap we didn't get around to filling.
Here's why that's the right call rather than an oversight:

- **Consistency.** The whole site uses one shared set of colors, spacing, and
  type sizes. If those were editable per-section through a CMS form, it would
  become very easy for one section to quietly drift out of sync with
  everything else — a slightly different blue here, a slightly different
  heading size there — and nobody would notice until the site looked
  inconsistent.
- **Quality and safety.** A code change goes through review before it ships —
  someone checks it doesn't break on mobile, doesn't clash with dark mode
  (if we add one), doesn't accidentally make text unreadable. A CMS field has
  none of that; whatever you type is what ships, immediately, to everyone.
  That's exactly right for a headline. It's the wrong safety margin for "make
  this button pink."
- **It's a different kind of tool.** A CMS like Sanity is built to manage
  _content_ — the words and pictures. A tool that lets you rearrange layout
  and restyle components on a live canvas is a genuinely different category
  of product (think Webflow, Framer, or a drag-and-drop page builder).
  `afram-dashboard` actually had an early prototype of exactly that kind of
  visual canvas editor at `/dashboard/cms`, before it was replaced with
  Sanity Studio — it just never had anywhere durable to save its work. Sanity
  solved the "save the work" problem properly; it was never trying to solve
  "let anyone restyle the page," and it's not the right tool for that job.

So: **content, yes, everything reasonable. Design, no — that stays in code,
on purpose, the same way it would at any well-run company.**

## What's live and editable right now

These are connected end-to-end: an edit in Sanity Studio (inside
`afram-dashboard`, at `/dashboard/cms`) shows up on the real site the next
time that page is requested. No redeploy, no engineer involved.

### Navigation (the header menu, on every page)

- The label on the "Verify a title" link.
- Every menu group (Buyers / Vendors / Financiers-style items) — its label,
  where it links to, its accent color, and its dropdown items (each with a
  label, a short description, and a link).

### Footer (on every page)

- The tagline under the logo ("Liberating Capital.").
- The "Company" and "Follow us" link columns.
- The newsletter box's heading, body text, and button label.
- The legal links row (Terms, Privacy Policy, Cookie Policy).
- The copyright line — write it once with `{year}` and `{name}` as
  placeholders and it fills itself in automatically.

### Home page

- **Hero** — the "Powered by" eyebrow text, the big headline, the hero photo,
  both buttons (label and link), and the three "For Buyers / For Vendors /
  For Financiers" role cards (each card's headline text, link, and photo —
  the card's background color and layout stay fixed, so the row always looks
  intentional no matter what's typed into it).
- **Partner logos strip** — the "Trusted by leading institutions" heading and
  the logos themselves.
- **Featured properties** — the heading, the sub-text, and the "See more"
  button. (The property cards themselves are always live marketplace data —
  see the note above.)
- **More properties** — same idea: heading and button, live data underneath.
- **Affordability calculator** — the eyebrow, title, and intro paragraph
  above the calculator. The calculator itself (the slider, the math) is a
  working tool, not copy, so it stays in code.
- **Insights (articles) strip** — the heading, sub-text, and "See all"
  button. The articles themselves already had their own, separate connection
  to Sanity before this project started (they're a proper collection —
  multiple documents, one per article — not part of the homepage document).

### How it Works page

- The top headline and intro.
- Each of the four numbered steps' title and description (the icon next to
  each step stays fixed, so a step can't accidentally end up without one).
- The "Verify a title" section's heading, body text, and button label.
- The closing "Ready to get started?" heading.

## What's modeled in Sanity but not switched on yet

**The About page.** There's a full schema for it in Sanity — hero, "our
story," "what we stand for," a contact section, a closing banner — but
`afram-website` doesn't actually have an About page built yet. There's
nothing wrong with the Sanity side; there's just no page on the live site for
it to feed content into yet. Once an About page exists, wiring it up is the
same kind of work as the Home page was.

## What we planned to build but haven't gotten to

**The Developers page and the Financiers page.** These are real, well-built
pages today — a hero, a row of value-proposition cards, a couple of
page-specific sections (like a yield-range breakdown for financiers), and an
FAQ. Right now every word of that is hardcoded in the page's code, the same
way the homepage used to be before this project started. Making it
CMS-editable is entirely realistic — it's genuinely comparable in size to the
work already done for the homepage — it just hasn't been done yet. It's the
natural next chunk of work if this keeps going.

**Privacy Policy.** Worth calling out specifically: the actual page today
says, in its own words, _"This is placeholder content. Replace with your
full privacy policy… before launch."_ There's no real legal text to connect
to Sanity yet — that's a legal/compliance task, not an engineering one. Once
real policy text exists, dropping it into a Sanity document is a small job.

## What will never be in the CMS, and that's fine

- Property, transaction, and user data — always live, always from the real
  API, for the reasons above.
- Sign in, sign up, and title-verification flows — these are working
  software, not copy.
- The affordability calculator's math.
- Anything about layout, spacing, color, typography, or animation — design
  stays in code, reviewed like any other code change.

## "I want to change X — where do I go?"

| You want to change…                                     | Where                                                                                         |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| The homepage headline, hero photo, or buttons           | `/dashboard/cms` → Home page → Hero                                                           |
| The three "For Buyers/Vendors/Financiers" cards         | `/dashboard/cms` → Home page → Hero → Role cards                                              |
| The header menu                                         | `/dashboard/cms` → Navigation                                                                 |
| Footer links, tagline, or newsletter text               | `/dashboard/cms` → Footer                                                                     |
| The "How it Works" page copy                            | `/dashboard/cms` → How it Works page                                                          |
| An Insights article                                     | `/dashboard/cms` → Insight articles                                                           |
| A property's price, photos, or description              | The dashboard's actual property tools — not the CMS. That's live marketplace data.            |
| The color of a button, the width of a section, the font | A code change, reviewed like any other — not the CMS, on purpose (see above).                 |
| Developers or Financiers page copy                      | Not connected yet — currently a code change; a good candidate for the next round of CMS work. |
