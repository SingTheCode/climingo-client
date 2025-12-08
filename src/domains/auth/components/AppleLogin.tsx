"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { useAuth } from "@/domains/auth/hooks";

export default function AppleLogin() {
  const router = useRouter();
  const { signIn } = useAuth();

  const login = async () => {
    window.AppleID.auth.init({
      clientId: "com.climingo.app",
      redirectURI: `${window.location.origin}/oauth`,
      scope: "name email",
      usePopup: true,
    });

    try {
      const res = await window.AppleID.auth.signIn();
      await signIn(res.authorization.code, "apple", res.user);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message) {
          alert(error.message);
        }
        router.replace("/signIn");
      }
    }
  };

  return (
    <button
      className="relative flex justify-center items-center w-full h-[6.4rem] mt-[0.8rem] bg-[black] text-[white] rounded-2xl"
      name="애플로그인"
      onClick={login}
    >
      <Image
        src="/assets/apple.svg"
        alt="애플로 계속하기"
        width="43"
        height="60"
        className="absolute left-[1.2rem]"
      />
      <p>Apple로 계속하기</p>
    </button>
  );
}
