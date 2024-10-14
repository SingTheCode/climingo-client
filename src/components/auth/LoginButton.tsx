"use client";

import KakaoLogin from "@/components/auth/KakaoLogin";
import AppleLogin from "@/components/auth/AppleLogin";

export default function LoginButton() {
  return (
    <>
      <KakaoLogin />
      <AppleLogin />
    </>
  );
}
