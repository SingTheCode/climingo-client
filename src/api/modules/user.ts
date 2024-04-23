import {
  AuthorizingResponse,
  OAuthApiRequest,
  OAuthApiResponse,
  OAuthProvider,
} from "@/types/user";
import { api } from "@/api/axios";

// 회원가입 여부 및 사용자 정보 조회
export const oAuthApi = async (params: OAuthApiRequest) => {
  const res = await api.get<OAuthApiResponse>(`/auth/members/exist`, {
    params,
  });
  if (res.status !== 200) {
    throw new Error();
  }
  return res.data;
};

export const signInApi = async (params: {
  providerType: OAuthProvider;
  providerToken: string;
}) => {
  const res = await api.post<AuthorizingResponse>(`/sign-in`, params);
  if (res.status !== 200) {
    throw new Error();
  }
  return res.data;
};

export const signUpApi = async (params: {
  providerType: OAuthProvider;
  providerToken: string;
}) => {
  const res = await api.post<AuthorizingResponse>(`/sign-up`, params);
  if (res.status !== 200) {
    throw new Error();
  }
  return res.data;
};
