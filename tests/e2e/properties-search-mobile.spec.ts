import { devices, expect, test, type Page } from "@playwright/test";

/* AFX-LST-058: at phone width the text search disappeared into the Filters
   sheet. The Location box must be on the page and return what desktop
   returns for the same query.

   The query is taken from a live listing's name rather than hard-coded:
   listings come from the backend, so a fixed name (the report used "Roman")
   stops matching anything once that listing is gone. */

const summaryOf = (page: Page) => page.getByText(/propert(y|ies) found/);

/** The longest word in the first listing's name — specific enough to narrow
 *  the results, and guaranteed to match at least that listing. */
async function queryFromFirstListing(page: Page): Promise<string> {
  await page.goto("/properties");
  const name = await page.locator("main h3").first().textContent();
  const word = (name ?? "")
    .split(/\s+/)
    .filter((w) => /^[a-z]+$/i.test(w))
    .sort((a, b) => b.length - a.length)[0];
  expect(word, `no usable word in listing name "${name}"`).toBeTruthy();
  return word;
}

async function resultCount(page: Page, query: string) {
  await page.goto("/properties");
  const box = page.getByRole("searchbox", { name: "Location" });
  await expect(box).toBeVisible();
  await box.fill(query);
  await expect(summaryOf(page)).toBeVisible();
  return summaryOf(page).textContent();
}

test("search on a phone returns the same results as desktop", async ({ browser }) => {
  const desktop = await browser.newContext({ ...devices["Desktop Chrome"] });
  const phone = await browser.newContext({ ...devices["Pixel 7"] });

  const desktopPage = await desktop.newPage();
  const query = await queryFromFirstListing(desktopPage);

  const onDesktop = await resultCount(desktopPage, query);
  const onPhone = await resultCount(await phone.newPage(), query);

  expect(onDesktop).not.toMatch(/^0 /);
  expect(onPhone).toBe(onDesktop);

  await desktop.close();
  await phone.close();
});
