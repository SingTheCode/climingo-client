"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { createContext, useContext, type ReactNode } from "react";

import type { OAuthProvider } from "@/domains/auth/types/entity";

import { useAuth } from "@/domains/auth/hooks/useAuth";

interface OAuthButtonContextValue {
  provider: OAuthProvider;
  onLogin: () => void;
}

const OAuthButtonContext = createContext<OAuthButtonContextValue | null>(null);

const useOAuthButtonContext = () => {
  const context = useContext(OAuthButtonContext);
  if (!context) {
    throw new Error("OAuthButton 컴포넌트 내부에서 사용해야 합니다");
  }
  return context;
};

interface OAuthButtonProps {
  provider: OAuthProvider;
  children: ReactNode;
}

export const OAuthButton = ({ provider, children }: OAuthButtonProps) => {
  const router = useRouter();
  const { signIn } = useAuth();

  const onLogin = async () => {
    if (provider === "kakao") {
      const query = new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID || "",
        redirect_uri: `${window.location.origin}/oauth`,
        response_type: "code",
      });
      router.push(`https://kauth.kakao.com/oauth/authorize?${query}`);
      return;
    }

    if (provider === "apple") {
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
        if (error instanceof Error && error.message) {
          alert(error.message);
        }
        router.replace("/signIn");
      }
    }
  };

  return (
    <OAuthButtonContext.Provider value={{ provider, onLogin }}>
      {children}
    </OAuthButtonContext.Provider>
  );
};

const Trigger = ({ children }: { children: ReactNode }) => {
  const { provider, onLogin } = useOAuthButtonContext();

  const bgColor = provider === "kakao" ? "bg-3rd-party-kakao" : "bg-black";
  const textColor = provider === "apple" ? "text-white" : "";

  return (
    <button
      className={`relative flex justify-center items-center w-full h-[6.4rem] mt-[0.8rem] ${bgColor} ${textColor} rounded-2xl`}
      onClick={onLogin}
    >
      {children}
    </button>
  );
};

OAuthButton.Trigger = Trigger;

const Icon = () => {
  const { provider } = useOAuthButtonContext();

  const iconSrc =
    provider === "kakao" ? "/assets/kakao.svg" : "/assets/apple.svg";
  const alt = provider === "kakao" ? "카카오로 시작하기" : "Apple로 계속하기";

  return (
    <Image
      src={iconSrc}
      alt={alt}
      width={43}
      height={60}
      className="absolute left-[1.2rem]"
    />
  );
};

OAuthButton.Icon = Icon;

const Label = ({ children }: { children: ReactNode }) => {
  return <p>{children}</p>;
};

OAuthButton.Label = Label;
