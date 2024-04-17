"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { oAuthApi, signInApi } from "@/api/modules/user";

export default function OAuth() {
  const router = useRouter();
  const code = useSearchParams().get("code");

  const oAuth = async () => {
    if (!code) {
      return;
    }

    const params = {
      provider: "kakao",
      redirectUri: `${process.env.NEXT_PUBLIC_HOST}`,
      code,
    } as const;

    const { isAlreadySignUp, provider, oAuthToken } = await oAuthApi(params);

    if (isAlreadySignUp) {
      // TODO: userInfo store 에 저장
      await signInApi({
        provider,
        oAuthToken,
      });

      // TODO: 둘러보기 페이지로 이동
      router.push("/");
      return;
    }
    router.push("/signUp");
  };
  oAuth();

  return <div></div>;
}