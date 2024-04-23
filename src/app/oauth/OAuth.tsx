"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { OAuthApiRequest, OAuthProvider } from "@/types/user";
import { useUserQuery, useSignInQuery } from "@/api/hooks/useUserQuery";

export default function OAuth() {
  const router = useRouter();
  const code = useSearchParams().get("code") || "";

  const [signInRequestParams, setSignInRequestParams] = useState<{
    providerType: OAuthProvider;
    providerToken: string;
  }>({
    providerType: "kakao",
    providerToken: "",
  });
  const [oAuthRequestParams, setOAuthRequestParams] = useState<OAuthApiRequest>(
    {
      providerType: "kakao",
      redirectUri: "",
      code: "",
    }
  );
  const { data, isFetched } = useUserQuery(oAuthRequestParams);
  useSignInQuery(signInRequestParams);

  useEffect(() => {
    const params: OAuthApiRequest = {
      providerType: "kakao",
      redirectUri: window.location.origin + window.location.pathname,
      code,
    } as const;
    setOAuthRequestParams(params);
  }, []);
  useEffect(() => {
    if (!isFetched) {
      return;
    }
    if (!data) {
      alert("로그인이 정상적으로 이루어지지 않았어요.");
      router.push("/signIn");
      return;
    }

    if (data.registered) {
      setSignInRequestParams({
        providerType: data.memberInfo.providerType,
        providerToken: data.memberInfo.providerToken,
      });
      // TODO: 둘러보기 페이지로 이동
      router.push("/");
      return;
    }
    router.push("/signUp");
  }, [isFetched]);

  return <div></div>;
}
