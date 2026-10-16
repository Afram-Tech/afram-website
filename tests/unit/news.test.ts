import { describe, expect, it } from "vitest";

import { matchesKeywords, mergeNews, NEWS_SOURCES } from "@/features/landing/data/news";
import { parseArticleHtml, parseInline, readingMinutes } from "@/lib/article-blocks";
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
    <description><![CDATA[<p>GREDA wants the state to lead.</p>]]></description>
    <media:content url="https://www.myjoyonline.com/wp-content/uploads/greda.jpg" medium="image"/>
    <content:encoded><![CDATA[<p>The <strong>Ghana Real Estate</strong> Developers Association says&#8230;</p>]]></content:encoded>
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
      summary: "GREDA wants the state to lead.",
      author: "Reporter",
      image: "https://www.myjoyonline.com/wp-content/uploads/greda.jpg",
      html: "<p>The <strong>Ghana Real Estate</strong> Developers Association says&#8230;</p>",
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

  it("parses the article body only for the stories kept, dropping a duplicate lead image", () => {
    const merged = mergeNews(
      [
        {
          source: "MyJoyOnline",
          items: [
            {
              ...item("https://www.myjoyonline.com/new/", "2026-10-05T00:00:00.000Z"),
              image: "https://cdn.example.com/lead.jpg",
              html: '<img src="https://cdn.example.com/lead.jpg"><p>Body text.</p>',
            },
            item("https://www.myjoyonline.com/old/", "2026-10-01T00:00:00.000Z"),
          ],
        },
      ],
      1,
    );

    expect(merged).toHaveLength(1);
    expect(merged[0].body).toEqual([{ type: "paragraph", spans: [{ text: "Body text." }] }]);
    expect(merged[0].readMinutes).toBe(1);
  });
});

describe("matchesKeywords", () => {
  const mlnrKeywords = NEWS_SOURCES.find((s) => s.name.startsWith("Ministry of Lands"))!.keywords!;
  // Real titles and categories from mlnr.gov.gh/feed/ (Oct 2026).
  const post = (title: string, categories: string[]) => ({
    title,
    link: "https://mlnr.gov.gh/x/",
    publishedAt: "2026-10-01T00:00:00.000Z",
    categories,
  });

  it("keeps the ministry's land posts", () => {
    expect(
      matchesKeywords(
        post("Ghana Begins Review of 1999 Land Policy to Shape Modern Land Governance", ["Land"]),
        mlnrKeywords,
      ),
    ).toBe(true);
    expect(
      matchesKeywords(
        post("Presidential Policy Delivery Unit Steps Up Support for Key Programmes", [
          "Forestry",
          "Land",
        ]),
        mlnrKeywords,
      ),
    ).toBe(true);
  });

  it("drops mining posts that only mention the Lands Minister", () => {
    expect(
      matchesKeywords(
        post("Ghana’s Mineral Wealth Must Benefit Host Communities — Lands Minister", [
          "News and Updates",
          "Economy",
        ]),
        mlnrKeywords,
      ),
    ).toBe(false);
    expect(matchesKeywords(post("Landmark mining deal signed", ["Mining"]), mlnrKeywords)).toBe(
      false,
    );
  });

  it("matches multi-word phrases across any whitespace, ignoring case", () => {
    expect(matchesKeywords(post("NEW LANDS\u00a0COMMISSION FEES", []), ["lands commission"])).toBe(
      true,
    );
  });
});

describe("parseArticleHtml", () => {
  it("keeps paragraphs, headings, quotes, lists and https images, in order", () => {
    const blocks = parseArticleHtml(`
      <p class="wp-block-paragraph">First &amp; foremost.</p>
      <h2>The law</h2>
      <figure><img src="https://cdn.example.com/a.jpg" alt="A plot"><figcaption>Plot in Adenta</figcaption></figure>
      <blockquote><p>Quoted.</p></blockquote>
      <ul><li>One</li><li>Two</li></ul>
    `);

    expect(blocks).toEqual([
      { type: "paragraph", spans: [{ text: "First & foremost." }] },
      { type: "heading", spans: [{ text: "The law" }] },
      {
        type: "image",
        src: "https://cdn.example.com/a.jpg",
        alt: "A plot",
        caption: "Plot in Adenta",
      },
      { type: "quote", spans: [{ text: "Quoted." }] },
      { type: "list", ordered: false, items: [[{ text: "One" }], [{ text: "Two" }]] },
    ]);
  });

  it("drops scripts, iframes, embeds, javascript: links and non-https images", () => {
    const blocks = parseArticleHtml(`
      <script>alert(1)</script>
      <iframe src="https://evil.example"></iframe>
      <p>Safe <a href="javascript:alert(1)">link</a> <a href="https://gov.gh">gov</a></p>
      <img src="http://insecure.example/x.jpg">
      <p onclick="alert(1)">Click</p>
    `);

    expect(JSON.stringify(blocks)).not.toMatch(/alert|evil|insecure|onclick|javascript/);
    expect(blocks[0]).toEqual({
      type: "paragraph",
      spans: [{ text: "Safe link " }, { text: "gov", href: "https://gov.gh" }],
    });
    expect(blocks[1]).toEqual({ type: "paragraph", spans: [{ text: "Click" }] });
  });
});

describe("parseInline", () => {
  it("tracks nested emphasis and line breaks", () => {
    expect(parseInline("A <strong><em>case</em> name</strong><br>next")).toEqual([
      { text: "A " },
      { text: "case", bold: true, italic: true },
      { text: " name", bold: true },
      { text: "\nnext" },
    ]);
  });
});

describe("readingMinutes", () => {
  it("is at least one minute and scales with length", () => {
    const words = (n: number) => Array.from({ length: n }, () => "word").join(" ");
    expect(readingMinutes([{ type: "paragraph", spans: [{ text: "short" }] }])).toBe(1);
    expect(readingMinutes([{ type: "paragraph", spans: [{ text: words(660) }] }])).toBe(3);
  });
});
