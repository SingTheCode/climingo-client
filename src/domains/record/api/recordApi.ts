import type { RecordFilter, RecordReportApiRequest } from "@/domains/record/types/entity";
import type {
  LevelResponse,
  RecordListResponse,
  RecordDetailResponse,
  ReportReasonResponse,
  PresignedUrlResponse,
} from "@/domains/record/types/response";

import { api, uploadToPresignedUrl } from "@/api/fetchClient";

import {
  transformRecordListResponseToEntity,
  transformRecordDetailResponseToEntity,
  transformReportReasonResponseToEntity,
  transformLevelResponseToEntity,
} from "@/domains/record/api/transform";

export const recordApi = {
  // 기록 목록 조회
  async getRecordList(filter: RecordFilter = {}) {
    const params = new URLSearchParams();

    if (filter.gymId) params.append("gymId", filter.gymId.toString());
    if (filter.levelId) params.append("levelId", filter.levelId.toString());
    if (filter.memberId) params.append("memberId", filter.memberId.toString());
    if (filter.page) params.append("page", filter.page.toString());
    if (filter.size) params.append("size", filter.size.toString());

    const data = await api.get<RecordListResponse>(`/records?${params}`);
    return transformRecordListResponseToEntity(data);
  },

  // 기록 상세 조회
  async getRecordDetail(recordId: string) {
    const data = await api.get<RecordDetailResponse>(`/records/${recordId}`);
    return transformRecordDetailResponseToEntity(data);
  },

  // 기록 생성
  async createRecord(data: {
    gymId: number;
    levelId: number;
    videoUrl: string;
  }) {
    return api.post<{ recordId: number }>("/records", data);
  },

  // 기록 삭제
  async deleteRecord(recordId: string) {
    return api.delete<{ recordId: number }>(`/records/${recordId}`);
  },

  // 기록 신고
  async reportRecord(recordId: string, data: RecordReportApiRequest) {
    return api.post(`/records/${recordId}/report`, data);
  },

  // 신고 사유 목록 조회
  async getReportReasons() {
    const data = await api.get<ReportReasonResponse[]>("/reports/reasons");
    return data.map(transformReportReasonResponseToEntity);
  },

  // Presigned URL 조회
  async getPresignedUrl(params: { fileName: string; extension: string }) {
    return api.post<PresignedUrlResponse>("/s3/presigned-url", params);
  },

  // 비디오 업로드
  async uploadVideo(presignedUrl: string, file: File) {
    await uploadToPresignedUrl(presignedUrl, file);
  },

  // 암장별 난이도 조회
  async getLevelList(gymId: number) {
    const data = await api.get<LevelResponse[]>(`/gyms/${gymId}/levels`);
    return data.map(transformLevelResponseToEntity);
  },
};
