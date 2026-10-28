import { useMutation } from "@apollo/client/react";

import { submitSupportRequest as SUBMIT_SUPPORT_REQUEST } from "@/graphql/mutations";
import type {
  SubmitSupportRequestMutation,
  SubmitSupportRequestMutationVariables,
} from "@/types/generated/graphql";

export const useSubmitSupportRequest = () => {
  const [submitSupportRequest, rest] = useMutation<
    SubmitSupportRequestMutation,
    SubmitSupportRequestMutationVariables
  >(SUBMIT_SUPPORT_REQUEST);
  return { submitSupportRequest, ...rest };
};
