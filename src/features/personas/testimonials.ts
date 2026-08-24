export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  /** Initials shown in the avatar when there is no photo. */
  initials: string;
};

/**
 * Real vendor quotes only. The section this feeds does not render while this
 * list is empty, and that is deliberate: an obviously invented quote does
 * more damage than no quote at all. To publish, add entries with a real
 * name, project and permission.
 */
export const TESTIMONIALS: Testimonial[] = [];
