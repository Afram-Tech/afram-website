import { permanentRedirect } from "next/navigation";

/** The privacy policy moved under /legal with the rest of the legal pages. */
export default function PrivacyPolicyPage() {
  permanentRedirect("/legal/privacy");
}
