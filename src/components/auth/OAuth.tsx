"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { OAuthApiRequest } from "@/types/user";
import { useUserActions } from "@/store/user";
import { oAuthApi, signInApi } from "@/api/modules/user";

export default function OAuth() {
  const router = useRouter();
  const code = useSearchParams().get("code") || "";

  const { setUser } = useUserActions();

  useEffect(() => {
    const fetch = async () => {
      const params: OAuthApiRequest = {
        providerType: "kakao",
        redirectUri: window.location.origin + window.location.pathname,
        code,
      } as const;
      try {
        const { registered, memberInfo } = await oAuthApi(params);

        if (registered) {
          const data = await signInApi({
            providerType: memberInfo.providerType!,
            providerToken: memberInfo.providerToken,
          });

          setUser(data);
          router.push("/");
          return;
        }
        setUser(memberInfo);
        router.push("/signUp");
      } catch (err) {
        if (err instanceof Error) {
          if (err.message) {
            alert(err.message);
          }
          router.replace("/signIn");
        }
      }
    };
    fetch();
  }, [code, router, setUser]);

  return <div></div>;
}
