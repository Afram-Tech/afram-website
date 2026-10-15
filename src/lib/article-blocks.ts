/**
 * Turns a publisher's article HTML (RSS `content:encoded`) into plain data
 * the news reader renders with React, so no third-party markup, script or
 * style ever reaches the page. Only text, emphasis, http(s) links and https
 * images survive; anything else (embeds, iframes, share widgets, forms) is
 * dropped.
 *
 * Like `rss.ts`, this is a deliberately small reader for WordPress output,
 * not a general HTML parser.
 */
import { decodeEntities } from "./rss";

export interface InlineSpan {
  text: string;
  bold?: boolean;
  italic?: boolean;
  /** Only ever an absolute http(s) URL. */
  href?: string;
}

export type ArticleBlock =
  | { type: "paragraph"; spans: InlineSpan[] }
  | { type: "heading"; spans: InlineSpan[] }
  | { type: "quote"; spans: InlineSpan[] }
  | { type: "list"; ordered: boolean; items: InlineSpan[][] }
  | { type: "image"; src: string; alt: string; caption?: string };

/** Elements removed with everything inside them. */
const DROPPED = [
  "script",
  "style",
  "noscript",
  "iframe",
  "object",
  "embed",
  "svg",
  "form",
  "button",
  "video",
  "audio",
  "template",
  "select",
  "textarea",
];

const isWebUrl = (value: string) => /^https?:\/\//i.test(value);

function attr(tag: string, name: string): string | undefined {
  const match = tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i"));
  const value = match?.[2] ?? match?.[3];
  return value === undefined ? undefined : decodeEntities(value).trim();
}

/** Reads emphasis and links; every other tag is ignored but its text kept. */
export function parseInline(html: string): InlineSpan[] {
  const spans: InlineSpan[] = [];
  let bold = 0;
  let italic = 0;
  const links: (string | undefined)[] = [];

  const push = (raw: string) => {
    const text = decodeEntities(raw).replace(/[ \t\r\f\v]+/g, " ");
    if (!text) return;
    const href = links.at(-1);
    const span: InlineSpan = {
      text,
      ...(bold > 0 && { bold: true }),
      ...(italic > 0 && { italic: true }),
      ...(href && { href }),
    };
    const last = spans.at(-1);
    if (last && last.bold === span.bold && last.italic === span.italic && last.href === span.href) {
      last.text += span.text;
    } else {
      spans.push(span);
    }
  };

  for (const [token, closing, name] of html.matchAll(/<(\/?)([a-z0-9]+)\b[^>]*>|[^<]+/gi)) {
    if (!token.startsWith("<")) {
      push(token);
      continue;
    }
    const tag = name.toLowerCase();
    const delta = closing ? -1 : 1;
    if (tag === "strong" || tag === "b") bold = Math.max(0, bold + delta);
    else if (tag === "em" || tag === "i") italic = Math.max(0, italic + delta);
    else if (tag === "br") push("\n");
    else if (tag === "a") {
      if (closing) links.pop();
      else {
        const href = attr(token, "href");
        links.push(href && isWebUrl(href) ? href : undefined);
      }
    }
  }

  const first = spans[0];
  const last = spans.at(-1);
  if (first) first.text = first.text.replace(/^\s+/, "");
  if (last) last.text = last.text.replace(/\s+$/, "");
  return spans.filter((span) => span.text.length > 0);
}

const hasText = (spans: InlineSpan[]) => spans.some((span) => span.text.trim().length > 0);

function imageBlock(tag: string, caption?: string): ArticleBlock | undefined {
  const src = attr(tag, "src") ?? attr(tag, "data-src");
  if (!src || !/^https:\/\//i.test(src)) return undefined;
  return { type: "image", src, alt: attr(tag, "alt") ?? "", ...(caption && { caption }) };
}

const BLOCK =
  /<figure\b[^>]*>([\s\S]*?)<\/figure>|<(p|h[1-6]|blockquote|pre)\b[^>]*>([\s\S]*?)<\/\2>|<(ul|ol)\b[^>]*>([\s\S]*?)<\/\4>|<img\b[^>]*>/gi;

export function parseArticleHtml(html: string): ArticleBlock[] {
  let clean = html.replace(/<!--[\s\S]*?-->/g, "");
  for (const tag of DROPPED) {
    clean = clean
      .replace(new RegExp(`<${tag}\\b[\\s\\S]*?<\\/${tag}>`, "gi"), "")
      .replace(new RegExp(`<${tag}\\b[^>]*\\/?>`, "gi"), "");
  }

  const blocks: ArticleBlock[] = [];
  for (const match of clean.matchAll(BLOCK)) {
    const [whole, figureBody, blockTag, blockBody, listTag, listBody] = match;

    if (figureBody !== undefined) {
      const img = figureBody.match(/<img\b[^>]*>/i)?.[0];
      const caption = figureBody.match(/<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/i)?.[1];
      const captionText = caption
        ? parseInline(caption)
            .map((span) => span.text)
            .join("")
        : undefined;
      const image = img && imageBlock(img, captionText || undefined);
      if (image) blocks.push(image);
      continue;
    }

    if (listTag) {
      const items = [...listBody.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)]
        .map(([, body]) => parseInline(body))
        .filter(hasText);
      if (items.length > 0) blocks.push({ type: "list", ordered: listTag === "ol", items });
      continue;
    }

    if (blockTag) {
      const tag = blockTag.toLowerCase();
      for (const img of blockBody.match(/<img\b[^>]*>/gi) ?? []) {
        const image = imageBlock(img);
        if (image) blocks.push(image);
      }
      const spans = parseInline(blockBody.replace(/<\/p>\s*<p\b[^>]*>/gi, "<br><br>"));
      if (!hasText(spans)) continue;
      if (tag === "blockquote") blocks.push({ type: "quote", spans });
      else if (/^h[1-6]$/.test(tag)) blocks.push({ type: "heading", spans });
      else blocks.push({ type: "paragraph", spans });
      continue;
    }

    const image = imageBlock(whole);
    if (image) blocks.push(image);
  }
  return blocks;
}

/** Roughly how long the story takes to read, at 220 words a minute. */
export function readingMinutes(blocks: ArticleBlock[]): number {
  const words = blocks
    .flatMap((block) =>
      block.type === "list"
        ? block.items.flat()
        : block.type === "image"
          ? []
          : (block as { spans: InlineSpan[] }).spans,
    )
    .map((span) => span.text)
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
