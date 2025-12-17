import { api } from "@/api/axios";
import type {
  OAuthResponse,
  SignInResponse,
  SignUpResponse,
} from "@/domains/auth/types/response";
import type {
  OAuthRequest,
  SignInRequest,
  SignUpRequest,
  OAuthResult,
  User,
} from "@/domains/auth/types/entity";
import {
  transformOAuthResponseToEntity,
  transformSignInResponseToUser,
  transformSignUpResponseToUser,
} from "./transform";

export const authApi = {
  async checkOAuth(params: OAuthRequest): Promise<OAuthResult> {
    const response = await api.get<OAuthResponse>("/auth/members/exist", {
      params,
    });
    return transformOAuthResponseToEntity(response.data);
  },

  async signIn(params: SignInRequest): Promise<User> {
    const response = await api.post<SignInResponse>("/sign-in", params);
    return transformSignInResponseToUser(response.data);
  },

  async signUp(params: SignUpRequest): Promise<User> {
    const response = await api.post<SignUpResponse>("/sign-up", params);
    return transformSignUpResponseToUser(response.data);
  },

  async signOut(): Promise<void> {
    await api.delete("/sign-out");
  },

  async deleteAccount(): Promise<void> {
    await api.delete("/delete-member");
  },
};
