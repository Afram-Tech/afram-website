/**
 * A deliberately small RSS 2.0 reader — enough for the WordPress feeds the
 * news section reads (MyJoyOnline, The High Street Journal), not a general
 * XML parser. It pulls out only what we display: title, link, date and
 * the item's categories (for nothing more than debugging which tag a story
 * came from). Anything it can't read cleanly is dropped, never guessed.
 */

export interface RssItem {
  title: string;
  link: string;
  /** ISO 8601; items without a readable date are dropped. */
  publishedAt: string;
  categories: string[];
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  hellip: "…",
  ndash: "–",
  mdash: "—",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
};

/** Decodes the entities WordPress actually emits (numeric and a few named). */
export function decodeEntities(value: string): string {
  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
    if (code[0] === "#") {
      const n =
        code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(n) && n >= 0 && n <= 0x10ffff ? String.fromCodePoint(n) : match;
    }
    return NAMED_ENTITIES[code.toLowerCase()] ?? match;
  });
}

/** A tag's text: CDATA unwrapped, HTML tags stripped, entities decoded, whitespace collapsed. */
function text(raw: string): string {
  const unwrapped = raw.replace(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/, "$1");
  return decodeEntities(unwrapped.replace(/<[^>]+>/g, ""))
    .replace(/\s+/g, " ")
    .trim();
}

function first(block: string, tag: string): string | undefined {
  const match = block.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, "i"));
  return match ? text(match[1]) : undefined;
}

function all(block: string, tag: string): string[] {
  return [...block.matchAll(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, "gi"))]
    .map((m) => text(m[1]))
    .filter(Boolean);
}

export function parseRss(xml: string): RssItem[] {
  const items: RssItem[] = [];
  for (const [, block] of xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)) {
    const title = first(block, "title");
    const link = first(block, "link");
    const date = new Date(first(block, "pubDate") ?? "");
    if (!title || !link || !/^https?:\/\//.test(link) || Number.isNaN(date.getTime())) continue;
    items.push({
      title,
      link,
      publishedAt: date.toISOString(),
      categories: all(block, "category"),
    });
  }
  return items;
}
