import { useMutation } from "@apollo/client/react";

import { requestAccess as REQUEST_ACCESS } from "@/graphql/mutations";
import type {
  RequestAccessMutation,
  RequestAccessMutationVariables,
} from "@/types/generated/graphql";

export const useRequestAccess = () => {
  const [requestAccess, rest] = useMutation<RequestAccessMutation, RequestAccessMutationVariables>(
    REQUEST_ACCESS,
  );
  return { requestAccess, ...rest };
};
