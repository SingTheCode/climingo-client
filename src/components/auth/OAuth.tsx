"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { OAuthApiRequest } from "@/types/user";
import { useUserActions } from "@/store/user";
import { oAuthApi, signInApi } from "@/api/modules/user";
import { useDidMountEffect } from "@/hooks/common";

export default function OAuth() {
  const router = useRouter();
  const code = useSearchParams().get("code") || "";

  const { setUser } = useUserActions();

  useDidMountEffect(() => {
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
          sessionStorage.setItem("memberInfo", JSON.stringify(data));
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
