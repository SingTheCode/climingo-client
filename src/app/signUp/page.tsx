"use client";

import Link from "next/link";
import { notFound } from "next/navigation";

import useUserStore from "@/store/user";
import type { MemberInfo } from '@/domains/auth/types/entity';

import Layout from "@/components/common/Layout";
import NavigationHeader from "@/components/common/NavigationHeader";
import Avatar from "@/components/common/Avatar";
import { SignUp } from "@/domains/auth/components/SignUp";

export default function SignUpPage() {
  const memberInfo = useUserStore((state) => state.user);

  if (memberInfo === null) {
    return notFound();
  }

  const { profileUrl } = memberInfo as MemberInfo;

  return (
    <Layout containHeader>
      <NavigationHeader
        pageTitle="회원가입"
        hideBackButton
        hideHomeButton
        leftElement={
          <Link href="/signIn">
            <button className="text-shadow-dark">취소</button>
          </Link>
        }
      />
      <div className="w-full h-full flex flex-col items-center">
        <Avatar size="lg" src={profileUrl} alt="profile" />
        <SignUp>
          <SignUp.Form>
            <SignUp.Label>닉네임</SignUp.Label>
            <SignUp.Input
              maxLength={8}
              rules={[
                (value) =>
                  /^[a-zA-Z0-9가-힣]+$/.test(value) ||
                  "띄어쓰기 없이 영문,숫자,한글만 가능해요",
                (value) =>
                  (2 <= value.length && value.length <= 8) ||
                  "2글자 이상 8글자 이하만 가능해요",
              ]}
            />
          </SignUp.Form>
          <SignUp.Submit>완료</SignUp.Submit>
        </SignUp>
      </div>
    </Layout>
  );
}
