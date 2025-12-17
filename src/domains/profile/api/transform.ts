import type {
  MyProfileResponse,
  MyRecordListResponse,
} from "@/domains/profile/types/response";
import type { Profile, MyRecordList } from "@/domains/profile/types/entity";

export const transformMyProfileResponseToEntity = (
  response: MyProfileResponse
): Profile => ({
  memberId: response.memberId,
  nickname: response.nickname ?? "익명",
  providerType: response.providerType ?? "kakao",
  profileUrl: response.profileUrl ?? "",
  email: response.email ?? "",
});

export const transformMyRecordListResponseToEntity = (
  response: MyRecordListResponse
): MyRecordList => ({
  contents: response.contents ?? [],
  totalCount: response.totalCount ?? 0,
  resultCount: response.resultCount ?? 0,
  isEnd: response.isEnd ?? true,
});
