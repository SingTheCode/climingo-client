import { OAuthProvider } from "@/types/common";
import { OAuthApiResponse, UserInfo } from "@/types/user";
import { api } from "@/api/axios";

// 회원가입 여부 및 사용자 정보 조회
export const oAuthApi = async (params: {
  provider: OAuthProvider;
  redirectUri: string;
  code: string;
}) => {
  const res = await api.post<OAuthApiResponse>(`/auth/members/exist`, params);
  if (res.status !== 200) {
    throw new Error();
  }
  return res.data;
};

export const signInApi = async (params: {
  provider: OAuthProvider;
  oAuthToken: string;
}) => {
  const res = await api.post<UserInfo>(`/sign-in`, params);
  if (res.status !== 200) {
    throw new Error();
  }
  return res.data;
};

export const signUpApi = async (params: {
  provider: OAuthProvider;
  oAuthToken: string;
  userInfo: UserInfo;
}) => {
  const res = await api.post<UserInfo>(`/sign-up`, params);
  if (res.status !== 200) {
    throw new Error();
  }
  return res.data;
};