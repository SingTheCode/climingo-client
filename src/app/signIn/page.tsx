import Image from "next/image";
import LoginButton from "@/components/auth/LoginButton";

export default function SignIn() {
  return (
    <div className="w-full h-full flex flex-col justify-between items-center">
      <div className="pt-[10vh]">
        <img
          src="/assets/sub-logo.svg"
          alt="클라이밍 갈 땐, 클라밍고와 함께해요!"
          className="w-[25.6rem] h-[28rem]"
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
  );
}
