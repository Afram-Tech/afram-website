import { Source_Serif_4 } from "next/font/google";

/** The news reader's text face — a serif, as news is typeset. Exposed as a
 *  CSS variable and only applied inside a story, so the rest of the site
 *  keeps Montserrat. */
export const newsSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-news-serif",
  display: "swap",
});
