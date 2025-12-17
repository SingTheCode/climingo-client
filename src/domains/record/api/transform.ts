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
import type { Gym, Level, LevelColor } from "@/domains/place/types/entity";
import type {
  Record,
  MemberInfo,
  RecordMetadata,
  RecordList,
  RecordDetail,
  ReportReason,
} from "@/domains/record/types/entity";

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
  colorNameKo: response.levelName || "V0",
  colorNameEn: (response.colorNameEn || "white") as LevelColor,
  colorCode: response.levelColor || "#000000",
});

export const transformMemberInfoResponseToEntity = (
  response?: MemberInfoResponse | null
): MemberInfo | null => {
  if (!response) return null;

  return {
    memberId: response.memberId,
    nickname: response.nickname || "익명",
    profileImageUrl: response.profileImageUrl || null,
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
  records: response.contents.map(transformRecordMetadataResponseToEntity),
  totalElements: response.totalElements || 0,
  totalPages: response.totalPages || 0,
  size: response.size || 10,
  currentPage: response.number || 0,
  isFirst: response.first ?? true,
  isLast: response.last ?? true,
});

export const transformRecordDetailResponseToEntity = (
  response: RecordDetailResponse
): RecordDetail => ({
  ...transformRecordMetadataResponseToEntity(response),
  description: response.description || "",
  tags: response.tags || [],
});

export const transformReportReasonResponseToEntity = (
  response: ReportReasonResponse
): ReportReason => ({
  id: response.reasonId,
  text: response.reasonText || "",
});
