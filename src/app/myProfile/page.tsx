"use client";

import Image from "next/image";
import Link from "next/link";

import Layout from "@/domains/common/components/Layout";
import NavigationHeader from "@/domains/common/components/NavigationHeader";
import MyProfile from "@/domains/user/components/profile/MyProfile";

export default function MyProfilePage() {
  return (
    <Layout containHeader>
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
    </Layout>
  );
}
