import {
  MemberInfo,
  OAuthApiRequest,
  OAuthApiResponse,
  OAuthProvider,
} from "@/domains/auth/types/auth";
import { api } from "@/shared/api/axios";

export interface MemberInfoResponse {
  authId?: string;
  email?: string;
  memberId: number;
  nickname: string;
  profileUrl: string;
  providerType?: OAuthProvider;
}

export const oAuthApi = async (params: OAuthApiRequest) => {
  const res = await api.post<OAuthApiResponse>("/oauth", params);
  return res.data;
};

export const signInApi = async (params: {
  providerType: OAuthProvider;
  providerToken: string;
}) => {
  const res = await api.post<MemberInfo>("/sign-in", params);
  return res.data;
};

export const signUpApi = async (params: MemberInfo) => {
  const res = await api.post<MemberInfo>("/sign-up", params);
  return res.data;
};

export const signOutApi = async () => {
  const res = await api.post("/sign-out");
  return res.data;
};

export const deleteAccountApi = async () => {
  const res = await api.delete("/members");
  return res.data;
};

export const getMyProfileApi = async () => {
  const res = await api.get<MemberInfo>("/members/me");
  return res.data;
};

export const editNicknameApi = async (nickname: string) => {
  const res = await api.patch<MemberInfo>("/members/me", { nickname });
  return res.data;
};

export const getMyRecordListApi = async () => {
  const res = await api.get("/members/me/records");
  return res.data;
};
