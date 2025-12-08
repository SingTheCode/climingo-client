"use client";

import type { MemberInfo } from "@/domains/auth/types/auth";

import useUserStore from "@/domains/auth/store/user";

import SignUpForm from "@/domains/auth/components/SignUpForm";
import Avatar from "@/shared/components/Avatar";

/**
 * SignUp 페이지에서 전역 user state가 있는 경우에만 해당 컴포넌트 렌더링
 * 참고 - app/signUp/page.tsx
 */
export default function SignUp() {
  const user = useUserStore((state) => state.user);
  const { profileUrl } = user as MemberInfo;

  return (
    <div className="w-full h-full flex flex-col items-center">
      <Avatar size="lg" src={profileUrl} alt="profile" />
      <SignUpForm />
    </div>
  );
}
