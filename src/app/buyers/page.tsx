import { redirect } from "next/navigation";

// The dedicated buyers page is retired — send buyers straight to the
// browse/properties experience.
export default function BuyersPage() {
  redirect("/properties");
}
