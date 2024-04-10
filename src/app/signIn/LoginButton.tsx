"use client";

import { useRouter } from "next/navigation";

export default function LoginButton() {
  const router = useRouter();
  const kakaoLogin = () => {
    const query = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID || "",
      redirect_uri: `${process.env.NEXT_PUBLIC_HOST}/oauth`,
      response_type: "code",
    });
    router.push(`https://kauth.kakao.com/oauth/authorize?${query}`);
  };

  return (
    <>
      <button
        className="relative flex justify-center items-center w-full h-[6.4rem] mt-[0.8rem] bg-kakao rounded-2xl"
        name="카카오로그인"
        onClick={kakaoLogin}
      >
        <img
          src="kakao.svg"
          alt="카카오로 시작하기"
          className="absolute left-[1.2rem]"
        />
        <p>카카오로 시작하기</p>
      </button>
      <button
        className="relative flex justify-center items-center w-full h-[6.4rem] mt-[0.8rem] bg-[black] text-[white] rounded-2xl"
        name="애플로그인"
      >
        <img
          src="apple.svg"
          alt="애플로 계속하기"
          className="absolute left-[1.2rem]"
        />
        <p>Apple로 계속하기</p>
      </button>
    </>
  );
}
