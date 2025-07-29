"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { isAxiosError } from "axios";

import { MemberInfo, OAuthProvider } from "@/types/auth";
import { deleteAccountApi, signOutApi } from "@/api/modules/user";
import useGetMyProfileQuery from "@/hooks/profile/useGetMyProfileQuery";
import useEditNicknameQuery from "@/hooks/profile/useEditNicknameQuery";
import useUserStore from "@/store/user";

import Avatar from "@/components/common/Avatar";
import InputText from "@/components/common/InputText";
import LayerPopup from "@/components/common/LayerPopup";

const MyProfileDetail = () => {
  const { data, isSuccess } = useGetMyProfileQuery();

  if (!isSuccess) return null;

  return (
    <section className="flex flex-col gap-[2rem] py-[2rem]">
      <EditableProfile
        memberId={data.memberId}
        nickname={data.nickname}
        profileUrl={data.profileUrl}
      />
      <DetailMemberInfo
        oAuth={{
          email: data.email,
          provider: data.providerType,
        }}
      />
    </section>
  );
};

export default MyProfileDetail;

interface EditableProfileProps {
  memberId: number;
  nickname: string;
  profileUrl?: string;
}

const EditableProfile = ({
  memberId,
  nickname,
  profileUrl,
}: EditableProfileProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(nickname);
  const [serverErrorMessage, setServerErrorMessage] = useState("");

  const isValidNickname = useRef(false);

  const { mutate: editNickname } = useEditNicknameQuery(memberId);

  const checkIsValidNickname = (valid: boolean) => {
    isValidNickname.current = valid;
    setServerErrorMessage("");
  };

  const handleNicknameEdit = () => {
    // 이전 닉네임과 동일하면 변경하지 않고 팝업 닫기
    if (value === nickname) {
      setOpen(false);
      return;
    }

    if (!isValidNickname) {
      return;
    }

    editNickname(value, {
      onSuccess: () => {
        setOpen(false);
      },
      onError: (error) => {
        if (isAxiosError(error) && error.response?.status === 409) {
          setServerErrorMessage("이미 존재하는 닉네임이에요");
        }
      },
    });
  };

  return (
    <section className="flex flex-col items-center gap-[1.5rem]">
      {profileUrl && (
        <Avatar size="lg" alt="profile-avatar" src={profileUrl} priority />
      )}

      <div className="flex gap-[0.2rem] relative -right-[0.5rem]">
        <p className="text-xl font-bold">{nickname}</p>
        <button className="select-none" onClick={() => setOpen(true)}>
          <Image
            src="/icons/icon-edit.svg"
            alt="profile-edit"
            width="24"
            height="23"
          />
        </button>
      </div>

      <LayerPopup open={open} onClose={() => setOpen(false)} fullscreen>
        <LayerPopup.Header title="프로필 수정">
          <button onClick={handleNicknameEdit}>완료</button>
        </LayerPopup.Header>
        <LayerPopup.Body>
          <div className="flex flex-col py-[2rem] gap-[2rem]">
            {profileUrl && (
              <Avatar
                size="lg"
                alt="profile-avatar"
                src={profileUrl}
                className="rounded-full self-center"
                priority
              />
            )}
            <div className="relative flex flex-col gap-[0.5rem]">
              <h3>닉네임</h3>
              <InputText
                value={value}
                setText={setValue}
                maxLength={8}
                rules={[
                  (value) =>
                    /^[a-zA-Z0-9가-힣]+$/.test(value) ||
                    "띄어쓰기 없이 영문,숫자,한글만 가능해요",
                  (value) =>
                    (2 <= value.length && value.length <= 8) ||
                    "2글자 이상 8글자 이하만 가능해요",
                ]}
                checkValid={checkIsValidNickname}
              />
              {/** TODO: InputText serverValidation이 동작하면 제거 */}
              <p className="absolute bottom-0 text-red text-xs">
                {serverErrorMessage}
              </p>
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

const DetailMemberInfo = ({ oAuth }: { oAuth: OAuthInfo }) => {
  return (
    <section className="flex flex-col gap-[4rem] items-start">
      <OAuthEmail email={oAuth.email} provider={oAuth.provider} />
      <div className="flex flex-col gap-[1rem]">
        <SignOutButton />
        <DeleteAccountButton />
      </div>
    </section>
  );
};

const OAuthEmail = ({ email, provider }: OAuthInfo) => {
  return (
    <div className="flex flex-col gap-[1rem]">
      <h3>SNS계정</h3>
      <div className="flex items-center gap-[1rem]">
        <OAuthIcon oAuthType={provider} />
        <p className={`${email ? "text-ink" : "text-shadow-dark"}`}>
          {email || "등록된 이메일이 없어요"}
        </p>
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
        width="25"
        height="35"
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

const SignOutButton = () => {
  const router = useRouter();

  const handleButtonClick = async () => {
    try {
      if (confirm("정말 로그아웃을 진행할까요?")) {
        await signOutApi();
        useUserStore.getState().clearUser();
        router.replace("/");
      }
    } catch {
      console.log("로그아웃에 실패했어요");
      useUserStore.getState().clearUser();
      router.replace("/");
    }
  };

  return (
    <button onClick={handleButtonClick}>
      <p className="text-shadow-dark text-sm">로그아웃하기</p>
    </button>
  );
};

const DeleteAccountButton = () => {
  const router = useRouter();

  const handleButtonClick = async () => {
    try {
      if (confirm("정말 회원탈퇴를 진행할까요?")) {
        await deleteAccountApi();
        useUserStore.getState().clearUser();
        router.replace("/");
      }
    } catch {
      alert("회원 탈퇴에 실패했어요. 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <button onClick={handleButtonClick}>
      <p className="text-shadow-dark text-sm">회원탈퇴하기</p>
    </button>
  );
};
