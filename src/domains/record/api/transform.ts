import type {
  RecordResponse,
  GymResponse,
  LevelResponse,
  MemberInfoResponse,
  RecordMetadataResponse,
  RecordListResponse,
  RecordDetailResponse,
  ReportReasonResponse,
} from '@/domains/record/types/response';
import type {
  Record,
  Gym,
  Level,
  MemberInfo,
  RecordMetadata,
  RecordList,
  RecordDetail,
  ReportReason,
} from '@/domains/record/types/entity';

// 기본 엔티티 변환 함수들
export const transformRecordResponseToEntity = (response: RecordResponse): Record => ({
  id: response.recordId,
  thumbnailUrl: response.thumbnailUrl || '',
  videoUrl: response.videoUrl || '',
  createdAt: new Date(response.createTime),
});

export const transformGymResponseToEntity = (response: GymResponse): Gym => ({
  id: response.gymId,
  name: response.gymName || '장소 없음',
  address: response.address || '',
  latitude: response.latitude || 0,
  longitude: response.longitude || 0,
});

export const transformLevelResponseToEntity = (response: LevelResponse): Level => ({
  id: response.levelId,
  name: response.levelName || 'V0',
  color: response.levelColor || '#000000',
});

export const transformMemberInfoResponseToEntity = (response?: MemberInfoResponse | null): MemberInfo | null => {
  if (!response) return null;
  
  return {
    id: response.memberId,
    nickname: response.nickname || '익명',
    profileImageUrl: response.profileImageUrl || null,
  };
};

// 복합 엔티티 변환 함수들
export const transformRecordMetadataResponseToEntity = (response: RecordMetadataResponse): RecordMetadata => ({
  record: transformRecordResponseToEntity(response.record),
  gym: transformGymResponseToEntity(response.gym),
  level: transformLevelResponseToEntity(response.level),
  memberInfo: transformMemberInfoResponseToEntity(response.memberInfo),
});

export const transformRecordListResponseToEntity = (response: RecordListResponse): RecordList => ({
  records: response.contents.map(transformRecordMetadataResponseToEntity),
  totalElements: response.totalElements || 0,
  totalPages: response.totalPages || 0,
  size: response.size || 10,
  currentPage: response.number || 0,
  isFirst: response.first ?? true,
  isLast: response.last ?? true,
});

export const transformRecordDetailResponseToEntity = (response: RecordDetailResponse): RecordDetail => ({
  ...transformRecordMetadataResponseToEntity(response),
  description: response.description || '',
  tags: response.tags || [],
});

export const transformReportReasonResponseToEntity = (response: ReportReasonResponse): ReportReason => ({
  id: response.reasonId,
  text: response.reasonText || '',
});
