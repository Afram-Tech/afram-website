import { expect, test } from "@playwright/test";

/* AFX-LST-059: the Price bands read in dollars ("Under $100,000") over
   listings priced in GHS. They must name the listings' currency, and a band
   must return only listings whose price falls inside it. */
test("price bands use the listings' currency and filter by it", async ({ page }) => {
  await page.goto("/properties");
  await page.getByRole("button", { name: "Price" }).click();

  const bands = [
    "Under GHS 100,000",
    "GHS 100,000 – GHS 300,000",
    "GHS 300,000 – GHS 600,000",
    "Over GHS 600,000",
  ];
  for (const band of bands) await expect(page.getByRole("button", { name: band })).toBeVisible();
  await expect(page.getByRole("button", { name: /\$/ })).toHaveCount(0);

  await page.getByRole("button", { name: "GHS 300,000 – GHS 600,000" }).click();

  // Each card's headline price sits under its "From" label.
  const prices = page.locator("p:text-is('From') + p");
  await expect(prices.first()).toBeVisible();
  for (const text of await prices.allTextContents()) {
    expect(text).toMatch(/^GHS\s/); // Intl puts a no-break space after the code
    const amount = Number(text.replace(/[^\d.]/g, ""));
    expect(amount).toBeGreaterThanOrEqual(300_000);
    expect(amount).toBeLessThanOrEqual(600_000);
  }
});
