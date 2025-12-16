import { useInfiniteQuery } from '@tanstack/react-query';
import { profileApi } from '@/domains/profile/api/profileApi';

export const useGetMyRecordListQuery = () => {
  return useInfiniteQuery({
    queryKey: ['profile', 'me', 'records'],
    queryFn: ({ pageParam }) => profileApi.getMyRecordList({ page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      !lastPage.isEnd ? lastPage.resultCount + 1 : null,
  });
};
