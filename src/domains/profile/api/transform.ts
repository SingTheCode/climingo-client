import type { MyProfileResponse } from '@/domains/profile/types/response';
import type { Profile } from '@/domains/profile/types/entity';

export const transformMyProfileResponseToEntity = (
  response: MyProfileResponse
): Profile => ({
  memberId: response.memberId,
  nickname: response.nickname ?? '익명',
  providerType: response.providerType ?? 'kakao',
  profileUrl: response.profileUrl ?? '',
  email: response.email ?? '',
});
