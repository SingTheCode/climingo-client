import type { Profile, MyRecordList } from "@/domains/profile/types/entity";
import type {
  EditNicknameRequest,
  EditProfileRequest,
  MyRecordListParams,
} from "@/domains/profile/types/request";
import type {
  MyProfileResponse,
  EditNicknameResponse,
  EditProfileResponse,
  MyRecordListResponse,
} from "@/domains/profile/types/response";

import { api } from "@/api/fetchClient";

import {
  transformMyProfileResponseToEntity,
  transformEditProfileResponseToEntity,
  transformMyRecordListResponseToEntity,
} from "./transform";

export const profileApi = {
  async getMyProfile(): Promise<Profile> {
    const data = await api.get<MyProfileResponse>("/members");
    return transformMyProfileResponseToEntity(data);
  },

  async editNickname(params: EditNicknameRequest): Promise<string> {
    const data = await api.patch<EditNicknameResponse>(
      `/members/${params.memberId}/nickname`,
      { nickname: params.nickname }
    );
    return data.nickname;
  },

  async editProfile(params: EditProfileRequest): Promise<Partial<Profile>> {
    const data = await api.patch<EditProfileResponse>(
      `/members/${params.memberId}`,
      {
        physicalInfo: {
          weight: params.weight,
          height: params.height,
          armSpan: params.armSpan,
        },
      }
    );
    return transformEditProfileResponseToEntity(data);
  },

  async getMyRecordList(params: MyRecordListParams): Promise<MyRecordList> {
    const data = await api.get<MyRecordListResponse, MyRecordListParams>(
      "/myRecords",
      {
        params,
      }
    );
    return transformMyRecordListResponseToEntity(data);
  },
};
