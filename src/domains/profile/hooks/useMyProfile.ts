import { useSuspenseQuery } from '@tanstack/react-query';
import { profileApi } from '@/domains/profile/api/profileApi';

export const useMyProfile = () => {
  const { data: profile } = useSuspenseQuery({
    queryKey: ['profile', 'my'],
    queryFn: () => profileApi.getMyProfile(),
  });

  return {
    profile,
  };
};
