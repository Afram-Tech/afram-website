import { devices, expect, test, type Page } from "@playwright/test";

/* AFX-LST-058: at phone width the "Search properties..." box went with the
   filter pills into the Filters sheet's place and disappeared. It must be on
   the page and return what desktop returns for the same query. */
const QUERY = "Roman";

const resultCount = async (page: Page) => {
  await page.goto("/properties");
  await page.getByRole("searchbox", { name: "Search properties" }).fill(QUERY);
  const summary = page.getByText(/propert(y|ies) found/);
  await expect(summary).toBeVisible();
  return summary.textContent();
};

test("search on a phone returns the same results as desktop", async ({ browser }) => {
  const desktop = await browser.newContext({ ...devices["Desktop Chrome"] });
  const phone = await browser.newContext({ ...devices["Pixel 7"] });

  const onDesktop = await resultCount(await desktop.newPage());
  const onPhone = await resultCount(await phone.newPage());

  expect(onDesktop).not.toMatch(/^0 /);
  expect(onPhone).toBe(onDesktop);

  await desktop.close();
  await phone.close();
});
