"use client";

import Image from "next/image";
import { useState } from "react";

import { MemberInfo, OAuthProvider } from "@/types/user";
import useGetMyProfileQuery from "@/hooks/profile/useGetMyProfileQuery";

import LayerPopup from "@/components/common/LayerPopup";
import Avatar from "@/components/common/Avatar";
import InputText from "@/components/common/InputText";
import Loading from "@/components/common/Loading";

const MyProfileInfo = () => {
  const { data, isSuccess } = useGetMyProfileQuery();

  if (!isSuccess)
    return (
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2">
        <Loading />
      </div>
    );

  return (
    <section className="flex flex-col gap-[2rem] py-[2rem]">
      <EditableProfile nickname={data.nickname} profileUrl={data.profileUrl} />
      {/** TODO: API 수정 후 data.email로 수정 */}
      <DetailProfile
        oAuth={{
          email: "kkr1226@naver.com",
          provider: data.providerType,
        }}
      />
    </section>
  );
};

export default MyProfileInfo;

interface EditableProfileProps {
  nickname: string;
  profileUrl: string;
}

const EditableProfile = ({ nickname, profileUrl }: EditableProfileProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(nickname);

  return (
    <section className="flex flex-col items-center gap-[1.5rem]">
      <Avatar size="lg" alt="profile-avatar" src={profileUrl} priority />

      <div className="flex gap-[0.2rem] relative -right-[0.5rem]">
        <p className="text-xl font-bold">{nickname}</p>
        <button className="select-none" onClick={() => setOpen(true)}>
          <Image
            src="/icons/icon-edit.svg"
            alt="profile-edit"
            width={24}
            height={23}
          />
        </button>
      </div>

      <LayerPopup open={open} onClose={() => setOpen(false)} fullscreen>
        <LayerPopup.Header>
          <LayerPopup.Title>프로필 수정</LayerPopup.Title>
          <button>완료</button>
        </LayerPopup.Header>
        <LayerPopup.Body>
          <div className="flex flex-col py-[2rem] gap-[2rem]">
            <Avatar
              size="lg"
              alt="profile-avatar"
              src={profileUrl}
              className="rounded-full self-center"
              priority
            />
            <div className="flex flex-col gap-[0.5rem]">
              <h3>닉네임</h3>
              <InputText value={value} setText={setValue} />
            </div>
          </div>
        </LayerPopup.Body>
      </LayerPopup>
    </section>
  );
};

interface OAuthInfo {
  email: MemberInfo["email"];
  provider: OAuthProvider;
}

const DetailProfile = ({ oAuth }: { oAuth: OAuthInfo }) => {
  return (
    <section>
      <OAuthEmail email={oAuth.email} provider={oAuth.provider} />
    </section>
  );
};

const OAuthEmail = ({ email, provider }: OAuthInfo) => {
  return (
    <div className="flex flex-col gap-[1rem]">
      <h3>이메일</h3>
      <div className="flex items-center gap-[1rem]">
        <OAuthIcon oAuthType={provider} />
        <p>{email}</p>
      </div>
    </div>
  );
};

const OAuthIcon = ({ oAuthType }: { oAuthType: OAuthProvider }) => {
  const { src, backgroundClass } = getOAuthIconProps(oAuthType);

  return (
    <div
      className={`relative rounded-full w-[3.5rem] h-[3.5rem] flex items-center justify-center overflow-hidden ${backgroundClass}`}
    >
      <Image
        src={src}
        width={25}
        height={35}
        className="w-[2.5rem] h-auto rounded-full object-contain"
        alt="oauth-icon"
      />
    </div>
  );
};

const getOAuthIconProps = (oAuthType: OAuthProvider) => {
  switch (oAuthType) {
    case "kakao":
      return {
        src: "/assets/kakao.svg",
        backgroundClass: "bg-3rd-party-kakao",
      };
    case "apple":
      return {
        src: "/assets/apple.svg",
        backgroundClass: "bg-black",
      };
  }
};
