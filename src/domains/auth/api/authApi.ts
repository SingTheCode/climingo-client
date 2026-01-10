import type {
  OAuthRequest,
  SignInRequest,
  SignUpRequest,
  OAuthResult,
  User,
} from "@/domains/auth/types/entity";
import type {
  OAuthResponse,
  SignInResponse,
  SignUpResponse,
} from "@/domains/auth/types/response";

import { api } from "@/api/fetchClient";

import {
  transformOAuthResponseToEntity,
  transformSignInResponseToUser,
  transformSignUpResponseToUser,
} from "./transform";

export const authApi = {
  async checkOAuth(params: OAuthRequest): Promise<OAuthResult> {
    const data = await api.get<OAuthResponse, OAuthRequest>(
      "/auth/members/exist",
      {
        params,
      }
    );
    return transformOAuthResponseToEntity(data);
  },

  async signIn(params: SignInRequest): Promise<User> {
    const data = await api.post<SignInResponse>("/sign-in", params);
    return transformSignInResponseToUser(data);
  },

  async signUp(params: SignUpRequest): Promise<User> {
    const data = await api.post<SignUpResponse>("/sign-up", params);
    return transformSignUpResponseToUser(data);
  },

  async signOut(): Promise<void> {
    await api.delete("/sign-out");
  },

  async deleteAccount(): Promise<void> {
    await api.delete("/delete-member");
  },
};
