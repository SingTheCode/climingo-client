import type { Gym, Level } from "@/domains/place/types/entity";
import type {
  Record,
  MemberInfo,
  RecordMetadata,
  RecordList,
  RecordDetail,
  ReportReason,
} from "@/domains/record/types/entity";
import type {
  RecordResponse,
  GymResponse,
  LevelResponse,
  MemberInfoResponse,
  RecordMetadataResponse,
  RecordListResponse,
  RecordDetailResponse,
  ReportReasonResponse,
} from "@/domains/record/types/response";

import { LEVELS } from "@/domains/place/constants/level";

// 기본 엔티티 변환 함수들
export const transformRecordResponseToEntity = (
  response: RecordResponse
): Record => ({
  recordId: response.recordId,
  thumbnailUrl: response.thumbnailUrl || "",
  videoUrl: response.videoUrl || "",
  createTime: response.createTime,
});

export const transformGymResponseToEntity = (response: GymResponse): Gym => ({
  gymId: response.gymId,
  gymName: response.gymName || "장소 없음",
});

export const transformLevelResponseToEntity = (
  response: LevelResponse
): Level => ({
  levelId: response.levelId,
  colorNameKo: response.colorNameKo || "V0",
  colorNameEn: response.colorNameEn || "white",
  colorCode:
    LEVELS.find((l) => l.colorNameEn === response.colorNameEn)?.colorCode ||
    "#ffffff",
});

export const transformMemberInfoResponseToEntity = (
  response?: MemberInfoResponse | null
): MemberInfo | null => {
  if (!response) return null;

  return {
    memberId: response.memberId,
    nickname: response.nickname || "익명",
    profileImageUrl: null,
    profileUrl: response.profileUrl || "",
  };
};

// 복합 엔티티 변환 함수들
export const transformRecordMetadataResponseToEntity = (
  response: RecordMetadataResponse
): RecordMetadata => ({
  record: transformRecordResponseToEntity(response.record),
  gym: transformGymResponseToEntity(response.gym),
  level: transformLevelResponseToEntity(response.level),
  memberInfo: transformMemberInfoResponseToEntity(response.memberInfo),
});

export const transformRecordListResponseToEntity = (
  response: RecordListResponse
): RecordList => ({
  contents: response.contents.map(transformRecordMetadataResponseToEntity),
  totalCount: response.totalCount || 0,
  totalPage: response.totalPage || 0,
  page: response.page || 0,
  isEnd: response.isEnd ?? true,
});

export const transformRecordDetailResponseToEntity = (
  response: RecordDetailResponse
): RecordDetail => ({
  record: transformRecordResponseToEntity(response.record),
  gym: transformGymResponseToEntity(response.gym),
  level: transformLevelResponseToEntity(response.level),
  memberInfo: transformMemberInfoResponseToEntity(response.memberInfo),
  description: "",
  tags: [],
});

export const transformReportReasonResponseToEntity = (
  response: ReportReasonResponse
): ReportReason => ({
  id: 0,
  text: response.description || "",
});
