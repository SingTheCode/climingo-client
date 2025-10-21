import {
  OAuthApiRequest,
  OAuthApiResponse,
  OAuthProvider,
  MemberInfo,
  MyProfileApiResponse,
} from "@/types/auth";
import { RecordListApiResponse } from "@/types/record";
import { api } from "@/api/axios";

export interface MemberInfoResponse {
  authId?: string;
  email?: string;
  memberId: number;
  nickname: string;
  profileUrl: string;
  providerType?: OAuthProvider;
}

// 회원가입 여부 및 사용자 정보 조회
export const oAuthApi = async (params: OAuthApiRequest) => {
  const res = await api.get<OAuthApiResponse>(`/auth/members/exist`, {
    params,
  });
  return res.data;
};

export const signInApi = async (params: {
  providerType: OAuthProvider;
  providerToken: string;
}) => {
  const res = await api.post<MemberInfo>(`/sign-in`, params);
  return res.data;
};

export const signUpApi = async (params: MemberInfo) => {
  const res = await api.post<MemberInfo>(`/sign-up`, params);
  return res.data;
};

// 내 프로필 정보 조회
export const getMyProfileApi = async () => {
  const res = await api.get<MyProfileApiResponse>("/members");
  return res.data;
};

// 내 프로필 닉네임 수정
export const editNicknameApi = async (memberId: number, data: string) => {
  const res = await api.patch(`/members/${memberId}/nickname`, {
    nickname: data,
  });
  return res.data;
};

export const signOutApi = async () => {
  await api.delete(`/sign-out`);
  return true;
};

export const deleteAccountApi = async () => {
  await api.delete(`/delete-member`);
  return true;
};

// 내 프로필 기록 페이징 조회
export const getMyRecordListApi = async (params: {
  page?: number;
  size?: number;
}) => {
  const res = await api.get<RecordListApiResponse>("/myRecords", { params });
  return res.data;
};
