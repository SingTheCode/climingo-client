export interface EditNicknameRequest {
  memberId: number;
  nickname: string;
}

export interface EditProfileRequest {
  memberId: number;
  weight?: number;
  height?: number;
  armSpan?: number;
}

export interface MyRecordListParams {
  page?: number;
  size?: number;
}
