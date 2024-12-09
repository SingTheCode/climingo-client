"use client";

import { useUserValue } from "@/store/user";
import { getProfileUrl } from "@/hooks/auth";

import SignUpForm from "@/components/auth/SignUpForm";
import Avatar from "@/components/common/Avatar";

export default function SignUp() {
  const user = useUserValue();

  return (
    <div className="w-full h-full flex flex-col items-center">
      <Avatar
        size="lg"
        src={getProfileUrl(user?.profileUrl)}
        alt="green boulder"
      />
      <SignUpForm />
    </div>
  );
}
