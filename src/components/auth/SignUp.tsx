"use client";

import type { MemberInfo } from "@/types/auth";

import { useUserValue } from "@/store/user";

import SignUpForm from "@/components/auth/SignUpForm";
import Avatar from "@/components/common/Avatar";

/**
 * SignUp 페이지에서 전역 user state가 있는 경우에만 해당 컴포넌트 렌더링
 * 참고 - app/signUp/page.tsx
 */
export default function SignUp() {
  const { profileUrl } = useUserValue() as MemberInfo;

  return (
    <div className="w-full h-full flex flex-col items-center">
      <Avatar size="lg" src={profileUrl} alt="profile" />
      <SignUpForm />
    </div>
  );
}
