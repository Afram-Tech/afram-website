import { expect, test } from "@playwright/test";

test("home page renders the hero section and role cards", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "A Transparent Real Estate Marketplace for Buyers, Vendors, and Financiers powered by Blockchain.",
    }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "View Properties" })).toBeVisible();
  await expect(page.getByRole("link", { name: /For Buyers/ })).toBeVisible();
});

test("nav links to the developers and financiers persona pages", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "List Properties" }).first().click();
  await expect(page).toHaveURL(/\/developers/);
  await expect(
    page.getByRole("heading", { name: "Raise Capital and accelerate sales" }),
  ).toBeVisible();
});
