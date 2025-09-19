import { dehydrate } from "@tanstack/query-core";
import { HydrationBoundary } from "@tanstack/react-query";

import getQueryClient from "@/hooks/getQueryClient";

import RecordDetail from "@/domains/record/components/RecordDetail";

export default async function HydratedRecordDetail() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["recordDetail"],
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <RecordDetail />
    </HydrationBoundary>
  );
}
