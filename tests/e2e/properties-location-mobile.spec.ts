import { devices, expect, test } from "@playwright/test";

/* AFX-LST-057: on phones the Location list was taller than the screen and
   didn't scroll, so the last regions (Volta, Western, Western North…) couldn't
   be reached. The picker must fit the screen and its list must scroll. */
test.use({ ...devices["Pixel 7"] });

test("every region can be reached and selected from Filters on a phone", async ({ page }) => {
  await page.goto("/properties");
  await page.getByRole("button", { name: "All regions" }).click();

  const list = page.locator('[role="listbox"]');
  await expect(list).toBeVisible();
  const fits = await list.evaluate((el) => {
    const dialog = el.closest("dialog")!.getBoundingClientRect();
    return dialog.bottom <= window.innerHeight + 1 && el.scrollHeight > el.clientHeight;
  });
  expect(fits, "the sheet fits the screen and its list scrolls").toBe(true);

  const region = page.getByRole("option", { name: /Western North/ }).first();
  await region.scrollIntoViewIfNeeded();
  await expect(region).toBeInViewport();
  await region.click();

  await expect(page).toHaveURL(/region=western-north/);
  await expect(page.locator("dialog[open]")).toHaveCount(0);
});
