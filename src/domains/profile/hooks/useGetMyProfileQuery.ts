import { useQuery } from '@tanstack/react-query';
import { getMyProfileApi } from '@/api/modules/user';

export const useGetMyProfileQuery = () => {
  return useQuery({
    queryKey: ['profile', 'me'],
    queryFn: () => getMyProfileApi(),
  });
};
