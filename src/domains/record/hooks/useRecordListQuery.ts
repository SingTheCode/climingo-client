import { useInfiniteQuery } from "@tanstack/react-query";

import type { MemberInfo } from "@/types/auth";
import type { Gym, Level } from "@/domains/record/types/record";
import { getRecordListApi } from "@/domains/record/api/record";

interface RequestFilter {
  gymId?: Gym["gymId"];
  levelId?: Level["levelId"];
  memberId?: MemberInfo["memberId"];
}

const useGetRecordListQuery = (filters: RequestFilter = {}) => {
  return useInfiniteQuery({
    queryKey: ["records", filters],
    queryFn: ({ pageParam }) =>
      getRecordListApi({ ...filters, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) =>
      !lastPage.isEnd ? lastPageParam + 1 : null,
  });
};

export default useGetRecordListQuery;
