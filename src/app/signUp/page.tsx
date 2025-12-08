"use client";

import Link from "next/link";
import { notFound } from "next/navigation";

import useUserStore from "@/domains/auth/store/user";

import Layout from "@/shared/components/Layout";
import NavigationHeader from "@/shared/components/NavigationHeader";
import SignUp from "@/domains/auth/components/SignUp";

export default function Page() {
  const memberInfo = useUserStore((state) => state.user);

  if (memberInfo === null) {
    return notFound();
  }

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
      <SignUp />
    </Layout>
  );
}
