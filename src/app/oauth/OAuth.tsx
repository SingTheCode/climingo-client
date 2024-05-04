"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { OAuthApiRequest } from "@/types/user";
import { useUserActions, useUserValue } from "@/store/user";
import { oAuthApi, signInApi } from "@/api/modules/user";

export default function OAuth() {
  const router = useRouter();
  const code = useSearchParams().get("code") || "";

  const user = useUserValue();
  const { setUser } = useUserActions();

  useEffect(() => {
    const fetch = async () => {
      const params: OAuthApiRequest = {
        providerType: "kakao",
        redirectUri: window.location.origin + window.location.pathname,
        code,
      } as const;
      const { registered, memberInfo } = await oAuthApi(params);

      if (registered) {
        const data = await signInApi({
          providerType: memberInfo.providerType,
          providerToken: memberInfo.providerToken,
        });

        setUser({ isAuthorized: !!data.authId, memberInfo: data });
        // TODO: 둘러보기 페이지로 이동
        router.push("/");
        return;
      }
      setUser({ isAuthorized: false, memberInfo });
      router.push("/signUp");
    };

    fetch();
  }, []);

  return <div></div>;
}