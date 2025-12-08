import { useInfiniteQuery } from "@tanstack/react-query";

import { getMyRecordListApi } from "@/domains/auth/api/user";

const useGetMyRecordListQuery = () => {
  return useInfiniteQuery({
    queryKey: ["profile", "me", "records"],
    queryFn: () => getMyRecordListApi(),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      !lastPage.isEnd ? lastPage.resultCount + 1 : null,
  });
};

export default useGetMyRecordListQuery;
