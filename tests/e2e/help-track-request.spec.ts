import { expect, test } from "@playwright/test";

/* The public tracker matches reference + reply email; requests raised while
   signed in to the app have no reply email, so the page points to the app's
   Help instead (GH-70). The lookup is stubbed: no request is ever found. */
test.beforeEach(async ({ page }) => {
  await page.route(/\/graph(ql)?(\?|$)/, async (route) => {
    const body = route.request().postDataJSON() as { operationName?: string } | null;
    if (body?.operationName !== "GetSupportRequestStatus") return route.continue();
    await route.fulfill({ json: { data: { getSupportRequestStatus: null } } });
  });
});

for (const viewport of [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 820, height: 1180 },
  { name: "desktop", width: 1440, height: 900 },
]) {
  test(`Track a request points app requests to the app's Help (${viewport.name})`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/help");

    const tracker = page.getByRole("region", { name: "Track a request" });
    await tracker.scrollIntoViewIfNeeded();
    await expect(tracker.getByText(/Raised it while signed in to the Afram app\?/)).toBeVisible();
    await expect(tracker.getByRole("link", { name: "Open Help in the app" })).toHaveAttribute(
      "href",
      /\/dashboard\/help$/,
    );

    await tracker.getByPlaceholder("AF-XXXXXX").fill("AF-ABC234");
    await tracker.getByPlaceholder("Your email").fill("ama@email.com");
    await tracker.getByRole("button", { name: "Check" }).click();

    await expect(tracker.getByText(/We couldn.t find/)).toBeVisible();
    await expect(
      tracker.getByText(/If you raised it while signed in to the Afram app/),
    ).toBeVisible();
    await expect(tracker.getByRole("link", { name: "Open Help in the app" })).toHaveCount(2);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}
