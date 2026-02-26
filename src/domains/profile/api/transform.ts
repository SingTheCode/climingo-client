import type { Profile, MyRecordList } from "@/domains/profile/types/entity";
import type {
  MyProfileResponse,
  MyRecordListResponse,
  EditProfileResponse,
} from "@/domains/profile/types/response";

import { transformRecordMetadataResponseToEntity } from "@/domains/record/api/transform";

export const transformMyProfileResponseToEntity = (
  response: MyProfileResponse
): Profile => ({
  memberId: response.memberId,
  nickname: response.nickname ?? "익명",
  providerType: response.providerType ?? "kakao",
  profileUrl: response.profileUrl ?? "",
  email: response.email ?? "",
  physicalInfo: response.physicalInfo,
});

export const transformEditProfileResponseToEntity = (
  response: EditProfileResponse
): Partial<Profile> => ({
  physicalInfo: response,
});

export const transformMyRecordListResponseToEntity = (
  response: MyRecordListResponse
): MyRecordList => ({
  contents: (response.contents ?? []).map(
    transformRecordMetadataResponseToEntity
  ),
  totalCount: response.totalCount ?? 0,
  resultCount: response.resultCount ?? 0,
  isEnd: response.isEnd ?? true,
});
