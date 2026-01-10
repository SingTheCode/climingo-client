import type {
  Profile,
  EditNicknameRequest,
  MyRecordListParams,
  MyRecordList,
} from "@/domains/profile/types/entity";
import type {
  MyProfileResponse,
  EditNicknameResponse,
  MyRecordListResponse,
} from "@/domains/profile/types/response";

import { api } from "@/api/fetchClient";

import {
  transformMyProfileResponseToEntity,
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
