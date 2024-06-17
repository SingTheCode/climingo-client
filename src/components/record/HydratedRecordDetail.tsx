import { dehydrate } from "@tanstack/query-core";
import { HydrationBoundary } from "@tanstack/react-query";
import RecordDetail from "@/components/record/RecordDetail";
import getQueryClient from "@/hooks/getQueryClient";

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
