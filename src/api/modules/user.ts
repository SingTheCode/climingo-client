import { API } from "@/api/axios";
import { OAuthProvider } from "@/types/common";

// 회원가입 여부 및 사용자 정보 조회
export const oAuthApi = async <T = any>(params: {
  provider: OAuthProvider;
  redirectUri: string;
  code: string;
}) => {
  const res = await API.post<T>(`/oauth`, params);

  if (res.status !== 200) {
    throw new Error();
  }
  return res.data;
};

export const signInApi = async <T = any>(params: {
  provider: OAuthProvider;
  oAuthToken: string;
}) => {
  const res = await API.post<T>(`/sign-in`, params);

  if (res.status !== 200) {
    throw new Error();
  }
  return res.data;
};

export const signUpApi = async <T = any>(params: {
  provider: OAuthProvider;
  oAuthToken: string;
  userInfo: object;
}) => {
  const res = await API.post<T>(`/sign-up`, params);

  if (res.status !== 200) {
    throw new Error();
  }
  return res.data;
};
