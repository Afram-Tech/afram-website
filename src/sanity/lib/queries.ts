/** Shared projection — everything an Insights article needs except the body. */
const ARTICLE_CARD_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  category,
  cover,
  author,
  "date": publishedAt,
  readMinutes
`;

export const ALL_ARTICLES_QUERY = `
  *[_type == "insightArticle"] | order(publishedAt desc) {
    ${ARTICLE_CARD_FIELDS}
  }
`;

export const ARTICLE_BY_SLUG_QUERY = `
  *[_type == "insightArticle" && slug.current == $slug][0] {
    ${ARTICLE_CARD_FIELDS},
    body
  }
`;
