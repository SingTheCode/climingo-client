import {
  OAuthApiRequest,
  OAuthApiResponse,
  OAuthProvider,
  MemberInfo,
  MyProfileApiResponse,
  MyRecordListApiResponse,
} from "@/types/user";
import { api } from "@/api/axios";

// 회원가입 여부 및 사용자 정보 조회
export const oAuthApi = async (params: OAuthApiRequest) => {
  const res = await api.get<OAuthApiResponse>(`/auth/members/exist`, {
    params,
  });
  if (res.status !== 200) {
    throw new Error("로그인이 정상적으로 이루어지지 않았어요.");
  }
  return res.data;
};

export const signInApi = async (params: {
  providerType: OAuthProvider;
  providerToken: string;
}) => {
  const res = await api.post<MemberInfo>(`/sign-in`, params);
  if (res.status !== 200) {
    throw new Error();
  }
  return res.data;
};

export const signUpApi = async (params: MemberInfo) => {
  const res = await api.post<MemberInfo>(`/sign-up`, params);
  if (res.status !== 200) {
    throw new Error();
  }
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

// 내 프로필 기록 페이징 조회
export const getMyRecordListApi = async (params: {
  page?: number;
  size?: number;
}) => {
  const res = await api.get<MyRecordListApiResponse>("/myRecords", { params });
  return res.data;
};
