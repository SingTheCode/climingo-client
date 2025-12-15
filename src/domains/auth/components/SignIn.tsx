'use client';

import { OAuthButton } from './OAuthButton';

export const SignIn = () => {
  return (
    <div className="flex flex-col w-full">
      <OAuthButton provider="kakao">
        <OAuthButton.Trigger>
          <OAuthButton.Icon />
          <OAuthButton.Label>카카오로 시작하기</OAuthButton.Label>
        </OAuthButton.Trigger>
      </OAuthButton>

      <OAuthButton provider="apple">
        <OAuthButton.Trigger>
          <OAuthButton.Icon />
          <OAuthButton.Label>Apple로 계속하기</OAuthButton.Label>
        </OAuthButton.Trigger>
      </OAuthButton>
    </div>
  );
};
