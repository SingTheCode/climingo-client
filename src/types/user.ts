import { Pagination } from "@/types/common";
import { RecordMetadata } from "@/types/record";

export type OAuthProvider = "kakao" | "apple";

export interface MemberInfo {
  nickname: string;
  profileUrl: string;
  memberId?: number;
  authId?: string;
  email?: string;
  providerType?: OAuthProvider;
}

export interface OAuthApiRequest {
  providerType: "kakao" | "apple";
  redirectUri: string;
  code: string;
}

export interface OAuthApiResponse {
  // 회원가입 여부
  registered: boolean;
  memberInfo: MemberInfo & { providerToken: string };
}

export type MyProfileApiResponse = Required<
  Pick<
    MemberInfo,
    "memberId" | "nickname" | "providerType" | "profileUrl" | "email"
  >
>;

export interface MyRecordListApiResponse extends Pagination {
  contents: RecordMetadata[];
}
