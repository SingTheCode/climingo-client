import { api } from "@/api/axios";
import axios from "axios";
import type { RecordFilter } from "@/domains/record/types/entity";
import type { Level } from "@/domains/place/types/entity";
import type {
  RecordListResponse,
  RecordDetailResponse,
  ReportReasonResponse,
} from "@/domains/record/types/response";
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

    const response = await api.get<RecordListResponse>(`/records?${params}`);
    return transformRecordListResponseToEntity(response.data);
  },

  // 기록 상세 조회
  async getRecordDetail(recordId: number) {
    const response = await api.get<RecordDetailResponse>(
      `/records/${recordId}`
    );
    return transformRecordDetailResponseToEntity(response.data);
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
    const response = await api.post("/records", data);
    return response.data;
  },

  // 기록 삭제
  async deleteRecord(recordId: number) {
    const response = await api.delete(`/records/${recordId}`);
    return response.data;
  },

  // 기록 신고
  async reportRecord(recordId: number, reasonId: number) {
    const response = await api.post(`/records/${recordId}/report`, {
      reasonId,
    });
    return response.data;
  },

  // 신고 사유 목록 조회
  async getReportReasons() {
    const response = await api.get<ReportReasonResponse[]>(
      "/records/report-reasons"
    );
    return response.data.map(transformReportReasonResponseToEntity);
  },

  // Presigned URL 조회
  async getPresignedUrl(fileName: string, fileType: string) {
    const response = await api.post("/records/presigned-url", {
      fileName,
      fileType,
    });
    return response.data;
  },

  // 비디오 업로드
  async uploadVideo(presignedUrl: string, file: File) {
    await axios.put(presignedUrl, file, {
      headers: { "Content-Type": file.type },
    });
  },

  // 암장별 난이도 조회
  async getLevelList(gymId: number) {
    const response = await api.get<Level[]>(`/gyms/${gymId}/levels`);
    return response.data.map((level) => ({
      ...level,
      colorCode:
        LEVELS.find((item) => item.colorNameEn === level.colorNameEn)
          ?.colorCode || "#ffffff",
    }));
  },
};
