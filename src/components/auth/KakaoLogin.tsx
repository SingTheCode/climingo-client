"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function KakaoLogin() {
  const router = useRouter();
  const kakaoLogin = () => {
    const query = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID || "",
      redirect_uri: `${window.location.origin}/oauth`,
      response_type: "code",
    });
    router.push(`https://kauth.kakao.com/oauth/authorize?${query}`);
  };

  return (
    <button
      className="relative flex justify-center items-center w-full h-[6.4rem] mt-[0.8rem] bg-3rd-party-kakao rounded-2xl"
      name="카카오로그인"
      onClick={kakaoLogin}
    >
      <Image
        src="/assets/kakao.svg"
        alt="카카오로 시작하기"
        width="43"
        height="60"
        className="absolute left-[1.2rem]"
      />
      <p>카카오로 시작하기</p>
    </button>
  );
}
