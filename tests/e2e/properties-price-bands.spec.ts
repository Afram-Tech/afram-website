import { expect, test } from "@playwright/test";

/* AFX-LST-059: the Price bands read in dollars ("Under $100,000") over
   listings priced in GHS. They must name the listings' currency, and a band
   must return only listings whose price falls inside it. */
test("price bands use the listings' currency and filter by it", async ({ page }) => {
  await page.goto("/properties");
  const price = page.getByLabel("Price");

  const bands = [
    "Under GHS 100,000",
    "GHS 100,000 – GHS 300,000",
    "GHS 300,000 – GHS 600,000",
    "Over GHS 600,000",
  ];
  const options = (await price.locator("option").allTextContents()).slice(1);
  expect(options).toEqual(bands);

  await price.selectOption({ label: "GHS 300,000 – GHS 600,000" });

  // Each card's headline price is the line that opens with a "From" label.
  const prices = page.locator("article p:has(> span:text-is('From'))");
  await expect(prices.first()).toBeVisible();
  for (const line of await prices.allTextContents()) {
    const text = line.replace(/^From\s*/, "");
    expect(text).toMatch(/^GHS\s/); // Intl puts a no-break space after the code
    const amount = Number(text.replace(/[^\d.]/g, ""));
    expect(amount).toBeGreaterThanOrEqual(300_000);
    expect(amount).toBeLessThanOrEqual(600_000);
  }
});
