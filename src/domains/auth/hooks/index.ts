import { useRouter } from "next/navigation";

import { OAuthApiRequest, OAuthProvider, SignInResponse } from "@/domains/auth/types/auth";
import { oAuthApi, signInApi } from "@/domains/auth/api/user";
import useUserStore from "@/store/user";

export const useAuth = () => {
  const router = useRouter();

  const setUser = useUserStore((state) => state.setUser);

  const signIn = async (
    token: string,
    providerType: OAuthProvider,
    user?: SignInResponse["user"]
  ) => {
    const params: OAuthApiRequest = {
      providerType,
      redirectUri: `${window.location.origin}/oauth`,
      code: token,
    } as const;
    const { registered, memberInfo } = await oAuthApi(params);

    const defaultProfileUrl = getDefaultProfileUrl(memberInfo.profileUrl);

    if (registered) {
      const data = await signInApi({
        providerType: memberInfo.providerType!,
        providerToken: memberInfo.providerToken,
      });

      setUser(data);

      router.push("/");
      return;
    }

    if (user) {
      setUser({
        ...memberInfo,
        email: user.email,
        nickname: user.name.lastName + user.name.firstName,
        profileUrl: defaultProfileUrl,
      });
    } else {
      setUser({
        ...memberInfo,
        profileUrl: defaultProfileUrl,
      });
    }
    router.push("/signUp");
  };
  return { signIn };
};

export const getDefaultProfileUrl = (profileUrl?: string) => {
  const boulderColors = ["blue", "green", "yellow", "red"];

  return (
    profileUrl ??
    `/assets/${boulderColors[Math.floor(Math.random() * 4)]}-boulder.svg`
  );
};
