import type { Level } from "@/domains/place/types/entity";
import type { RecordFilter } from "@/domains/record/types/entity";
import type {
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
} from "@/domains/record/api/transform";

import { LEVELS } from "@/domains/place/constants/level";

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
  async getRecordDetail(recordId: number) {
    const data = await api.get<RecordDetailResponse>(`/records/${recordId}`);
    return transformRecordDetailResponseToEntity(data);
  },

  // 기록 생성
  async createRecord(data: {
    gymId: number;
    levelId: number;
    videoUrl: string;
    thumbnailUrl: string;
    description?: string;
    tags?: string[];
  }) {
    return api.post("/records", data);
  },

  // 기록 삭제
  async deleteRecord(recordId: number) {
    return api.delete(`/records/${recordId}`);
  },

  // 기록 신고
  async reportRecord(recordId: number, reasonId: number) {
    return api.post(`/records/${recordId}/report`, { reasonId });
  },

  // 신고 사유 목록 조회
  async getReportReasons() {
    const data = await api.get<ReportReasonResponse[]>(
      "/records/report-reasons"
    );
    return data.map(transformReportReasonResponseToEntity);
  },

  // Presigned URL 조회
  async getPresignedUrl(
    fileName: string,
    fileType: string
  ): Promise<PresignedUrlResponse> {
    return api.post<PresignedUrlResponse>("/records/presigned-url", {
      fileName,
      fileType,
    });
  },

  // 비디오 업로드
  async uploadVideo(presignedUrl: string, file: File) {
    await uploadToPresignedUrl(presignedUrl, file);
  },

  // 암장별 난이도 조회
  async getLevelList(gymId: number) {
    const data = await api.get<Level[]>(`/gyms/${gymId}/levels`);
    return data.map((level) => ({
      ...level,
      colorCode:
        LEVELS.find((item) => item.colorNameEn === level.colorNameEn)
          ?.colorCode || "#ffffff",
    }));
  },
};
