"use client";

import { useUserValue } from "@/store/user";

import SignUpForm from "@/components/auth/SignUpForm";
import Avatar from "@/components/common/Avatar";

export default function SignUp() {
  const user = useUserValue();

  const boulderColors = ["blue", "green", "yellow", "red"];
  const profileUrl =
    user?.profileUrl ??
    `/assets/${boulderColors[Math.floor(Math.random() * 4)]}-boulder.svg`;

  return (
    <div className="w-full h-full flex flex-col items-center">
      <Avatar size="lg" src={profileUrl} alt="green boulder" />
      <SignUpForm />
    </div>
  );
}
