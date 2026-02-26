"use client";

import { AsyncBoundary } from "@/lib/async";

import { useProfileQuery } from "@/domains/profile/hooks/useProfileQuery";

import Layout from "@/components/Layout";
import NavigationHeader from "@/components/NavigationHeader";

import { ProfileDetail } from "@/domains/profile/components/ProfileDetail";

function ProfileDetailContent() {
  const { data: profile } = useProfileQuery();

  if (!profile) return null;

  return (
    <ProfileDetail profile={profile}>
      <ProfileDetail.Header />
      <ProfileDetail.Form>
        <ProfileDetail.Email />
        <ProfileDetail.NumberInput label="몸무게" field="weight" unit="kg" />
        <ProfileDetail.NumberInput label="키" field="height" unit="cm" />
        <ProfileDetail.NumberInput label="팔길이" field="armSpan" unit="cm" />
      </ProfileDetail.Form>
      <ProfileDetail.Footer>
        <ProfileDetail.SaveButton>저장하기</ProfileDetail.SaveButton>
        <div className="space-y-4 mt-8">
          <button className="w-full text-left text-shadow-dark">
            로그아웃하기
          </button>
          <button className="w-full text-left text-shadow-dark">
            탈퇴하기
          </button>
        </div>
      </ProfileDetail.Footer>
    </ProfileDetail>
  );
}

function ProfileDetailSkeleton() {
  return (
    <div className="p-4 animate-pulse">
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="w-28 h-28 bg-shadow rounded-full" />
        <div className="w-32 h-6 bg-shadow rounded" />
      </div>
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <div className="w-16 h-4 bg-shadow rounded" />
            <div className="w-full h-12 bg-shadow rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProfileDetailPage() {
  return (
    <Layout containHeader>
      <NavigationHeader pageTitle="내 정보" hideHomeButton />
      <AsyncBoundary
        pendingFallback={<ProfileDetailSkeleton />}
        rejectedFallback={() => (
          <div className="p-4 text-center text-red-500">
            프로필을 불러오는 중 오류가 발생했습니다.
          </div>
        )}
      >
        <ProfileDetailContent />
      </AsyncBoundary>
    </Layout>
  );
}
