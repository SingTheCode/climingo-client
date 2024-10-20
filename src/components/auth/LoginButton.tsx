"use client";

import Script from "next/script";

import KakaoLogin from "@/components/auth/KakaoLogin";
import AppleLogin from "@/components/auth/AppleLogin";

export default function LoginButton() {
  return (
    <>
      <Script src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js" />
      <KakaoLogin />
      <AppleLogin />
    </>
  );
}
