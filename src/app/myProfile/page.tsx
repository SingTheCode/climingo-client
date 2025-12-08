"use client";

import Image from "next/image";
import Link from "next/link";

import Layout from "@/shared/components/Layout";
import NavigationHeader from "@/shared/components/NavigationHeader";
import MyProfile from "@/domains/profile/components/MyProfile";

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
