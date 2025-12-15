import { useInfiniteQuery } from '@tanstack/react-query';
import { getMyRecordListApi } from '@/api/modules/user';

export const useGetMyRecordListQuery = () => {
  return useInfiniteQuery({
    queryKey: ['profile', 'me', 'records'],
    queryFn: ({ pageParam }) => getMyRecordListApi({ page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      !lastPage.isEnd ? lastPage.resultCount + 1 : null,
  });
};
