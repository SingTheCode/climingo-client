"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { EditProfile } from "@/domains/profile/components/EditProfile";
import { AsyncBoundary } from "@/lib/async";
import Layout from "@/components/common/Layout";
import NavigationHeader from "@/components/common/NavigationHeader";
import Avatar from "@/components/common/Avatar";
import LayerPopup from "@/components/common/LayerPopup";
import { useGetMyProfileQuery } from "@/domains/profile/hooks/useGetMyProfileQuery";
import { authApi } from "@/domains/auth/api/authApi";
import useUserStore from "@/store/user";
import type { OAuthProvider } from '@/domains/auth/types/entity';

function MyProfileDetailContent() {
  const { data } = useGetMyProfileQuery();
  const [editOpen, setEditOpen] = useState(false);

  if (!data) return null;

  return (
    <section className="flex flex-col gap-[2rem] py-[2rem]">
      <section className="flex flex-col items-center gap-[1.5rem]">
        {data.profileUrl && (
          <Avatar size="lg" alt="profile-avatar" src={data.profileUrl} priority />
        )}

        <div className="flex gap-[0.2rem] relative -right-[0.5rem]">
          <p className="text-xl font-bold">{data.nickname}</p>
          <button className="select-none" onClick={() => setEditOpen(true)}>
            <Image
              src="/icons/icon-edit.svg"
              alt="profile-edit"
              width={24}
              height={24}
            />
          </button>
        </div>
      </section>

      <DetailMemberInfo
        oAuth={{
          email: data.email,
          provider: data.providerType,
        }}
      />

      <LayerPopup open={editOpen} onClose={() => setEditOpen(false)}>
        <EditProfile initialNickname={data.nickname}>
          <div className="flex flex-col gap-[2rem] p-[2rem]">
            <h2 className="text-xl font-bold">닉네임 변경</h2>
            <EditProfile.Input maxLength={8} />
            <EditProfile.Submit memberId={data.memberId}>
              변경하기
            </EditProfile.Submit>
          </div>
        </EditProfile>
      </LayerPopup>
    </section>
  );
}

interface DetailMemberInfoProps {
  oAuth: {
    email: string;
    provider: OAuthProvider;
  };
}

function DetailMemberInfo({ oAuth }: DetailMemberInfoProps) {
  const router = useRouter();
  const clearUser = useUserStore((state) => state.clearUser);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await authApi.signOut();
      clearUser();
      router.push("/signIn");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await authApi.deleteAccount();
      clearUser();
      router.push("/signIn");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <section className="flex flex-col gap-[1rem]">
        <div className="flex justify-between">
          <p className="text-gray-600">이메일</p>
          <p>{oAuth.email}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-600">로그인 방식</p>
          <p>{oAuth.provider === "kakao" ? "카카오" : "Apple"}</p>
        </div>
      </section>

      <section className="flex flex-col gap-[1rem]">
        <button
          onClick={handleSignOut}
          className="w-full h-[5.6rem] border border-gray-300 rounded-lg"
        >
          로그아웃
        </button>
        <button
          onClick={() => setDeleteAccountOpen(true)}
          className="w-full h-[5.6rem] border border-red-500 text-red-500 rounded-lg"
        >
          회원탈퇴
        </button>
      </section>

      <LayerPopup open={deleteAccountOpen} onClose={() => setDeleteAccountOpen(false)}>
        <div className="flex flex-col gap-[2rem] p-[2rem]">
          <h2 className="text-xl font-bold">정말 탈퇴하시겠습니까?</h2>
          <p className="text-gray-600">
            탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
          </p>
          <div className="flex gap-[1rem]">
            <button
              onClick={() => setDeleteAccountOpen(false)}
              className="flex-1 h-[5.6rem] border border-gray-300 rounded-lg"
            >
              취소
            </button>
            <button
              onClick={handleDeleteAccount}
              className="flex-1 h-[5.6rem] bg-red-500 text-white rounded-lg"
            >
              탈퇴
            </button>
          </div>
        </div>
      </LayerPopup>
    </>
  );
}

export default function MyProfileDetailPage() {
  return (
    <Layout containHeader>
      <NavigationHeader pageTitle="내 정보" hideHomeButton />
      <AsyncBoundary
        pendingFallback={
          <div className="p-4">
            <div className="flex flex-col items-center gap-[1.5rem] animate-pulse">
              <div className="w-[8rem] h-[8rem] bg-shadow rounded-full"></div>
              <div className="w-[12rem] h-[2rem] bg-shadow"></div>
            </div>
          </div>
        }
        rejectedFallback={() => (
          <div className="p-4 text-center text-red-500">
            프로필을 불러오는 중 오류가 발생했습니다.
          </div>
        )}
      >
        <MyProfileDetailContent />
      </AsyncBoundary>
    </Layout>
  );
}
