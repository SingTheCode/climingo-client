import Image from "next/image";

import Layout from "@/shared/components/Layout";
import LoginButton from "@/domains/auth/components/LoginButton";

export default function SignIn() {
  return (
    <Layout>
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
          <LoginButton />
        </div>
      </div>
    </Layout>
  );
}
