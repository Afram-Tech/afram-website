import { useLazyQuery } from "@apollo/client/react";

import { getSupportRequestStatus as GET_SUPPORT_REQUEST_STATUS } from "@/graphql/queries";
import type {
  GetSupportRequestStatusQuery,
  GetSupportRequestStatusQueryVariables,
} from "@/types/generated/graphql";

/** Lazy, run on Check. Never cached: it's checked for news. */
export const useSupportRequestStatus = () => {
  const [getSupportRequestStatus, rest] = useLazyQuery<
    GetSupportRequestStatusQuery,
    GetSupportRequestStatusQueryVariables
  >(GET_SUPPORT_REQUEST_STATUS, { fetchPolicy: "no-cache" });
  return { getSupportRequestStatus, ...rest };
};
