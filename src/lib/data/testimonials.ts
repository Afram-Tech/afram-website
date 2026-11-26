export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  /** Initials shown in the avatar when there is no photo. */
  initials: string;
};

/**
 * Real vendor quotes only.
 *
 * The section does not render while this list is empty, and that is
 * deliberate: the research is explicit that this segment is alert to false
 * promises, and an obviously invented quote does more damage here than no
 * quote at all. Marketing's draft carried "[Vendor name]" as a
 * placeholder, so it is not shipped.
 *
 * To publish, add entries with a real name, project and permission.
 */
export const TESTIMONIALS: Testimonial[] = [];
