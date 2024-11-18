import { useRouter } from "next/navigation";

import { OAuthApiRequest, SignInResponse } from "@/types/auth";
import { oAuthApi, signInApi } from "@/api/modules/user";
import { useUserActions } from "@/store/user";
import useAuthSession from "@/hooks/useAuthStorage";

export const useAuth = () => {
  const router = useRouter();

  const { setUser } = useUserActions();
  const authSession = useAuthSession();

  const signIn = async (token: string, user?: SignInResponse["user"]) => {
    const params: OAuthApiRequest = {
      providerType: "apple",
      redirectUri: `${window.location.origin}/oauth`,
      code: token,
    } as const;
    const { registered, memberInfo } = await oAuthApi(params);

    if (registered) {
      const data = await signInApi({
        providerType: memberInfo.providerType!,
        providerToken: memberInfo.providerToken,
      });

      setUser(data);
      authSession.set(data);

      router.push("/");
      return;
    }

    if (user) {
      setUser({
        ...memberInfo,
        email: user.email,
        nickname: user.name.lastName + user.name.firstName,
      });
    } else {
      setUser(memberInfo);
    }
    router.push("/signUp");
  };
  return { signIn };
};
