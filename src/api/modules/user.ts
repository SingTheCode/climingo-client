import {
  UserState,
  OAuthApiRequest,
  OAuthApiResponse,
  OAuthProvider,
  UserInfo,
} from "@/types/user";
import { api } from "@/api/axios";
import { useRouter } from "next/navigation";

// 회원가입 여부 및 사용자 정보 조회
export const oAuthApi = async (params: OAuthApiRequest) => {
  const res = await api.get<OAuthApiResponse>(`/auth/members/exist`, {
    params,
  });
  if (res.status !== 200) {
    alert("로그인이 정상적으로 이루어지지 않았어요.");
    const router = useRouter();
    router.push("/signIn");
    throw new Error();
  }
  return res.data;
};

export const signInApi = async (params: {
  providerType: OAuthProvider;
  providerToken: string;
}) => {
  const res = await api.post<UserState["memberInfo"]>(`/sign-in`, params);
  if (res.status !== 200) {
    throw new Error();
  }
  return res.data;
};

export const signUpApi = async (params: UserInfo) => {
  const res = await api.post<UserState>(`/sign-up`, params);
  if (res.status !== 200) {
    throw new Error();
  }
  return res.data;
};