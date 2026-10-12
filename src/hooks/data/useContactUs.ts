import { useMutation } from "@apollo/client/react";

import { CONTACT_US } from "@/graphql/mutations";
import type { ContactUsMutation, ContactUsMutationVariables } from "@/types/generated/graphql";

export const useContactUs = () => {
  const [contactUs, rest] = useMutation<ContactUsMutation, ContactUsMutationVariables>(CONTACT_US);
  return { contactUs, ...rest };
};
