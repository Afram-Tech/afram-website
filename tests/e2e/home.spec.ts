import { expect, test } from "@playwright/test";

test("home page renders the hero section", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Afram Website" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Get started" })).toBeVisible();
});
