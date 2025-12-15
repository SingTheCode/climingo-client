import { api } from '@/api/axios';
import type { MyProfileResponse, EditNicknameResponse } from '@/domains/profile/types/response';
import type { Profile, EditNicknameRequest } from '@/domains/profile/types/entity';
import { transformMyProfileResponseToEntity } from './transform';

export const profileApi = {
  async getMyProfile(): Promise<Profile> {
    const response = await api.get<MyProfileResponse>('/members');
    return transformMyProfileResponseToEntity(response.data);
  },

  async editNickname(params: EditNicknameRequest): Promise<string> {
    const response = await api.patch<EditNicknameResponse>(
      `/members/${params.memberId}/nickname`,
      { nickname: params.nickname }
    );
    return response.data.nickname;
  },
};
