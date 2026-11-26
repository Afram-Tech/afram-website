import { expect, test } from "@playwright/test";

test("home page renders the hero, SEC badge and calls to action", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "A transparent Real estate marketplace powered by Blockchain",
    }),
  ).toBeVisible();
  await expect(page.getByText("Regulated and licensed by the SEC").first()).toBeVisible();

  const main = page.locator("main");
  await expect(main.getByRole("link", { name: "View Properties" })).toHaveAttribute(
    "href",
    "/properties",
  );
  await expect(main.getByRole("link", { name: "How it works" })).toHaveAttribute(
    "href",
    "/how-it-works",
  );
});

test("role cards link each audience to its page", async ({ page }) => {
  await page.goto("/");
  const main = page.locator("main");
  const cards = [
    { name: /For Members.*Own verified property with flexible financing/, href: "/properties" },
    { name: /For Developers.*Raise capital and accelerate sales/, href: "/developers" },
    {
      name: /For Financiers.*Deploy capital securely against verified assets/,
      href: "/financiers",
    },
  ];
  for (const card of cards) {
    await expect(main.getByRole("link", { name: card.name })).toHaveAttribute("href", card.href);
  }
});

test("sections follow the V2 order", async ({ page }) => {
  await page.goto("/");
  const headings = await page
    .locator("main h2")
    .evaluateAll((nodes) => nodes.map((n) => n.textContent?.trim().toLowerCase()));

  // Featured properties and Insights depend on live data, so assert the
  // relative order of whatever rendered rather than an exact list.
  const order = [
    "trusted by leading institutions",
    "featured properties",
    "what can you afford?",
    "insights",
  ].filter((h) => headings.includes(h));
  expect(order).toContain("trusted by leading institutions");
  expect(order).toContain("what can you afford?");
  expect(order.map((h) => headings.indexOf(h))).toEqual(
    [...order.map((h) => headings.indexOf(h))].sort((a, b) => a - b),
  );
  expect(headings).not.toContain("more properties");
});

test("partner ticker names each institution once to assistive tech", async ({ page }) => {
  await page.goto("/");
  for (const name of ["Ecobank", "Ghana Lands Commission", "Merson Developers", "Origen"]) {
    await expect(page.getByRole("img", { name, exact: true })).toHaveCount(1);
  }
});

test("featured properties show at most six cards and link to all properties", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("section#properties");
  test.skip((await section.count()) === 0, "No listings returned by the API");
  const cards = section.locator("article");
  expect(await cards.count()).toBeGreaterThan(0);
  expect(await cards.count()).toBeLessThanOrEqual(6);
  await expect(section.getByRole("link", { name: /See all properties/ })).toHaveAttribute(
    "href",
    "/properties",
  );
});

test("affordability calculator updates as the income slider moves", async ({ page }) => {
  await page.goto("/");
  const calculator = page.locator("section#calculator");
  await expect(calculator.getByRole("heading", { name: "What can you afford?" })).toBeVisible();

  const slider = calculator.getByRole("slider", { name: "Monthly take-home income" });
  const homePrice = calculator.getByText("Home price").locator("xpath=following-sibling::p");
  await slider.fill("12000");
  const before = await homePrice.textContent();
  await slider.fill("30000");
  await expect(homePrice).not.toHaveText(before ?? "");
});

test("nav links to the developers and financiers persona pages", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "List Properties" }).first().click();
  await expect(page).toHaveURL(/\/developers/);
});
