/**
 * Same SANITY_API_READ_TOKEN used by the Live Content API (see live.ts).
 * Kept as its own module because the draft-mode route needs to import just
 * the token, not the whole defineLive setup.
 */
export const token = process.env.SANITY_API_READ_TOKEN;
