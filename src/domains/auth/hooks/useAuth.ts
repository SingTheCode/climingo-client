import { useRouter } from 'next/navigation';
import { useOAuth } from './useOAuth';
import { useSignIn } from './useSignIn';
import type { OAuthProvider } from '@/domains/auth/types/entity';
import useUserStore from '@/store/user';

interface AppleUser {
  email: string;
  name: { firstName: string; lastName: string };
}

const getDefaultProfileUrl = (profileUrl?: string) => {
  const boulderColors = ['blue', 'green', 'yellow', 'red'];
  return (
    profileUrl ??
    `/assets/${boulderColors[Math.floor(Math.random() * 4)]}-boulder.svg`
  );
};

export const useAuth = () => {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const { checkOAuth } = useOAuth();
  const { signIn: signInMutation } = useSignIn();

  const signIn = async (
    token: string,
    providerType: OAuthProvider,
    appleUser?: AppleUser
  ) => {
    const oauthResult = await checkOAuth({
      providerType,
      redirectUri: `${window.location.origin}/oauth`,
      code: token,
    });

    const defaultProfileUrl = getDefaultProfileUrl(
      oauthResult.user.profileUrl
    );

    if (oauthResult.registered) {
      await signInMutation({
        providerType: oauthResult.user.providerType,
        providerToken: oauthResult.providerToken,
      });
      router.push('/');
      return;
    }

    if (appleUser) {
      setUser({
        ...oauthResult.user,
        email: appleUser.email,
        nickname: appleUser.name.lastName + appleUser.name.firstName,
        profileUrl: defaultProfileUrl,
      });
    } else {
      setUser({
        ...oauthResult.user,
        profileUrl: defaultProfileUrl,
      });
    }
    router.push('/signUp');
  };

  return { signIn };
};
