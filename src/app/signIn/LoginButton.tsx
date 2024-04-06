"use client";

import { useRouter } from "next/navigation";

export default function LoginButton() {
  const router = useRouter();
  const login = () => {
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
        className="flex justify-between items-center w-full h-[6.4rem] mt-[0.4rem] bg-kakao rounded-2xl"
        name="지금받을게요"
        onClick={login}
      >
        <img
          src="kakao.svg"
          alt="카카오로 시작하기"
          className="relative left-[1.2rem]"
        />
        <p className="relative right-[2rem]">카카오로 시작하기</p>
        <div />
      </button>
      <button className="flex justify-between items-center w-full h-[6.4rem] mt-[0.8rem] bg-[black] text-[white] rounded-2xl">
        <img
          src="apple.svg"
          alt="애플로 시작하기"
          className="relative left-[1.2rem]"
        />
        <p className="relative right-[2rem]">Apple로 계속하기</p>
        <div />
      </button>
    </>
  );
}
