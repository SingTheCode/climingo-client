import { useInfiniteQuery } from "@tanstack/react-query";

import { getRecordListApi } from "@/api/modules/record";

const useRecordListQuery = () => {
  return useInfiniteQuery({
    queryKey: ["records"],
    queryFn: ({ pageParam }) => getRecordListApi({ page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) =>
      !lastPage.isEnd ? lastPageParam + 1 : null,
  });
};

export default useRecordListQuery;
