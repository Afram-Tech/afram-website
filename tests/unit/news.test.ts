import { describe, expect, it } from "vitest";

import { mergeNews } from "@/features/landing/data/news";
import { decodeEntities, parseRss } from "@/lib/rss";

// Trimmed from a real WordPress feed (MyJoyOnline / The High Street Journal shape).
const FEED = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
<channel>
  <title>MyJoyOnline</title>
  <item>
    <title>Gov&#8217;t must lead affordable housing agenda &#8211; GREDA</title>
    <link>https://www.myjoyonline.com/govt-must-lead-affordable-housing-agenda/</link>
    <dc:creator><![CDATA[Reporter]]></dc:creator>
    <pubDate>Wed, 06 Aug 2025 10:00:00 +0000</pubDate>
    <category><![CDATA[Housing]]></category>
    <category><![CDATA[Real Estate]]></category>
    <description><![CDATA[<p>Should never be displayed.</p>]]></description>
  </item>
  <item>
    <title><![CDATA[Only 5% of Ghanaians can afford housing without support]]></title>
    <link>https://www.myjoyonline.com/only-5-of-ghanaians-can-afford-housing/</link>
    <pubDate>Mon, 05 Oct 2026 08:30:00 +0000</pubDate>
  </item>
  <item>
    <title>No date — dropped</title>
    <link>https://www.myjoyonline.com/no-date/</link>
  </item>
  <item>
    <title>Not a web link — dropped</title>
    <link>javascript:alert(1)</link>
    <pubDate>Mon, 05 Oct 2026 08:30:00 +0000</pubDate>
  </item>
</channel>
</rss>`;

describe("parseRss", () => {
  it("reads title, link, date and categories, decoding entities and CDATA", () => {
    const items = parseRss(FEED);
    expect(items).toHaveLength(2);
    expect(items[0]).toEqual({
      title: "Gov’t must lead affordable housing agenda – GREDA",
      link: "https://www.myjoyonline.com/govt-must-lead-affordable-housing-agenda/",
      publishedAt: "2025-08-06T10:00:00.000Z",
      categories: ["Housing", "Real Estate"],
    });
    expect(items[1].title).toBe("Only 5% of Ghanaians can afford housing without support");
  });

  it("drops items with no readable date or a non-http link", () => {
    const titles = parseRss(FEED).map((item) => item.title);
    expect(titles).not.toContain("No date — dropped");
    expect(titles).not.toContain("Not a web link — dropped");
  });

  it("returns [] for something that isn't a feed", () => {
    expect(parseRss("<html><body>Blocked</body></html>")).toEqual([]);
  });
});

describe("decodeEntities", () => {
  it("handles numeric, hex and common named entities", () => {
    expect(decodeEntities("A &amp; B &#8211; C &#x2019; &hellip;")).toBe("A & B – C ’ …");
  });

  it("leaves an out-of-range code point as-is instead of throwing", () => {
    expect(decodeEntities("x &#99999999; y")).toBe("x &#99999999; y");
  });
});

describe("mergeNews", () => {
  const item = (link: string, publishedAt: string, title = link) => ({
    title,
    link,
    publishedAt,
    categories: [],
  });

  it("collapses the same story across tags and tracking params, newest first", () => {
    const merged = mergeNews([
      {
        source: "MyJoyOnline",
        items: [
          item("https://www.myjoyonline.com/a/", "2026-10-01T00:00:00.000Z"),
          item("https://www.myjoyonline.com/b/", "2026-10-05T00:00:00.000Z"),
        ],
      },
      {
        source: "MyJoyOnline",
        items: [item("https://myjoyonline.com/a?utm_source=x", "2026-10-01T00:00:00.000Z")],
      },
      {
        source: "The High Street Journal",
        items: [item("https://thehighstreetjournal.com/c/", "2026-10-03T00:00:00.000Z")],
      },
    ]);

    expect(merged.map((n) => n.url)).toEqual([
      "https://www.myjoyonline.com/b/",
      "https://thehighstreetjournal.com/c/",
      "https://www.myjoyonline.com/a/",
    ]);
    expect(merged[1].source).toBe("The High Street Journal");
  });
});
