"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SignIn() {
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
    <div className="w-full h-full flex flex-col justify-between items-center">
      <div className="pt-[10vh]">
        <img
          src="sub-logo.svg"
          alt="클라이밍 갈 땐, 클라밍고와 함께해요!"
          className="w-[25.6rem] h-[28rem]"
        />
      </div>
      <div className="w-full flex flex-col justify-center items-center pb-[4vh]">
        <Image
          src="/login-tooltip.png"
          alt="소셜 계정으로 간편하게 시작하기"
          width="224"
          height="40"
          className="animate-bounce"
        />
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
      </div>
    </div>
  );
}
