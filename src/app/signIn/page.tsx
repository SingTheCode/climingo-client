import Image from 'next/image';
import Script from 'next/script';

import Layout from '@/components/Layout';
import { SignIn } from '@/domains/auth/components/SignIn';

export default function SignInPage() {
  return (
    <Layout>
      <Script src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js" />
      <div className="w-full h-full flex flex-col justify-between items-center">
        <div className="pt-[10vh]">
          <Image
            src="/assets/sub-logo.svg"
            alt="클라이밍 갈 땐, 클라밍고와 함께해요!"
            width="256"
            height="280"
          />
        </div>
        <div className="w-full flex flex-col justify-center items-center pb-[4vh]">
          <Image
            src="/assets/login-tooltip.png"
            alt="소셜 계정으로 간편하게 시작하기"
            width="224"
            height="40"
            className="animate-bounce"
          />
          <SignIn />
        </div>
      </div>
    </Layout>
  );
}
