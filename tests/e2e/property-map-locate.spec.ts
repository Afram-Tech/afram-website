import { expect, test } from "@playwright/test";

/**
 * The map must never ask for the visitor's location on its own unless the
 * browser already reports the permission as granted. Safari scopes a
 * geolocation grant to the page session, so an unconditional request on
 * mount means a permission prompt on every single refresh — which is what
 * this guards against.
 *
 * `navigator.geolocation` is replaced before any app code runs, so nothing
 * resolves until the test says so and a real prompt can never appear.
 */
const stubGeolocation = `
  window.__geoCalls = 0;
  window.__geoPending = null;
  Object.defineProperty(navigator, "geolocation", {
    configurable: true,
    value: {
      getCurrentPosition: (ok, err) => {
        window.__geoCalls++;
        window.__geoPending = { ok, err };
      },
      watchPosition: () => 0,
      clearWatch: () => {},
    },
  });
`;

/** What Safari reports even after the visitor has allowed location. */
const permissionsReport = (state: "prompt" | "granted") => `
  Object.defineProperty(navigator, "permissions", {
    configurable: true,
    value: { query: async () => ({ state: "${state}", onchange: null }) },
  });
`;

const locateButton = '[data-testid="map-locate-button"]';

test("map never requests location on load when the grant isn't already in place", async ({
  page,
}) => {
  await page.addInitScript(stubGeolocation + permissionsReport("prompt"));
  await page.goto("/properties/map");
  await page.waitForSelector(locateButton);
  // Long enough for the map's style to load and every mount effect to run.
  await page.waitForTimeout(2000);

  expect(await page.evaluate(() => window.__geoCalls)).toBe(0);

  await page.click(locateButton);
  expect(await page.evaluate(() => window.__geoCalls)).toBe(1);

  await page.evaluate(() =>
    window.__geoPending.ok({ coords: { latitude: 51.5, longitude: -0.12 } }),
  );
  await expect(page.getByRole("status")).toHaveText(/outside Ghana/);
});

test("map locates on load without being asked when the permission is already granted", async ({
  page,
}) => {
  await page.addInitScript(stubGeolocation + permissionsReport("granted"));
  await page.goto("/properties/map");
  await page.waitForSelector(locateButton);

  await expect.poll(() => page.evaluate(() => window.__geoCalls)).toBe(1);
  // Nothing was asked for, so nothing is reported back either.
  await expect(page.getByRole("status")).toHaveCount(0);
});

test("a denied request explains itself instead of failing silently", async ({ page }) => {
  await page.addInitScript(stubGeolocation + permissionsReport("prompt"));
  await page.goto("/properties/map");
  await page.waitForSelector(locateButton);

  await page.click(locateButton);
  await page.evaluate(() =>
    window.__geoPending.err({ code: 1, PERMISSION_DENIED: 1, message: "denied" }),
  );
  await expect(page.getByRole("status")).toHaveText(/blocked for this site/);
});

declare global {
  interface Window {
    __geoCalls: number;
    __geoPending: {
      ok: (position: { coords: { latitude: number; longitude: number } }) => void;
      err: (error: { code: number; PERMISSION_DENIED: number; message: string }) => void;
    };
  }
}
