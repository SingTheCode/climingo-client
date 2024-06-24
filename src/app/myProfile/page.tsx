"use client";

import Image from "next/image";
import Link from "next/link";

import Layout from "@/components/common/Layout";
import NavigationHeader from "@/components/common/NavigationHeader";
import MyProfile from "@/components/profile/MyProfile";
import AuthRequired from "@/components/common/AuthRequired";

export default function MyProfilePage() {
  return (
    <Layout containHeader>
      <AuthRequired>
        <NavigationHeader
          rightElement={
            <Link href="/record/create">
              <Image
                src="/icons/icon-write.svg"
                alt="기록하기"
                width={24}
                height={24}
              />
            </Link>
          }
        />
        <MyProfile />
      </AuthRequired>
    </Layout>
  );
}
