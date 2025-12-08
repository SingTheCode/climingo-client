"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import {
  createRecordApi,
  getPresignedUrlApi,
  uploadVideoApi,
} from "@/api/modules/record";

import BottomActionButton from "@/components/common/BottomActionButton";
import SelectPlaceWithLevel from "@/components/record/SelectPlaceWithLevel";
import UploadVideo from "@/components/record/UploadVideo";
import Caution from "@/components/record/Caution";

type FormValues = {
  place?: number;
  level?: number;
  video?: File;
};

const CreateRecordForm = () => {
  const router = useRouter();

  const [isPending, setIsPending] = useState(false);
  const [validation, setValidation] = useState({
    level: false,
    video: false,
  });

  const isValid = Object.values(validation).every(Boolean);

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    const formValues = Object.fromEntries(formData) as FormValues;

    if (!formValues.place || !formValues.level || !formValues.video) {
      return;
    }

    try {
      setIsPending(true);

      const splitFileNameExtension = (params: string) => {
        const lastDotIdx = params.lastIndexOf(".");
        const fileName = params.slice(0, lastDotIdx);
        const extension = params.slice(lastDotIdx + 1);

        return { fileName, extension };
      };
      const { presignedUrl, videoUrl } = await getPresignedUrlApi(
        splitFileNameExtension(formValues.video.name)
      );
      await uploadVideoApi({
        presignedUrl,
        file: formValues.video,
      });
      const { recordId } = await createRecordApi({
        gymId: Number(formValues.place),
        levelId: Number(formValues.level),
        videoUrl,
      });

      setIsPending(false);
      if (recordId) {
        router.push(`/record/${recordId}`);
      }
    } catch (error) {
      setIsPending(false);
      console.error(error);
    }
  };

  return (
    <form
      className="flex flex-col gap-[3rem] pt-[2rem] pb-[10rem]"
      onSubmit={handleFormSubmit}
    >
      <SelectPlaceWithLevel
        validate={(valid) => setValidation({ ...validation, level: valid })}
      />
      <UploadVideo
        validate={(valid) => setValidation({ ...validation, video: valid })}
      />
      <Caution>
        <Caution.Title>게시글 작성 유의사항</Caution.Title>
        <Caution.SubTitle>
          작성된 게시글은 아래와 같은 기준 하에 관리자에 의해 통보 없이 임의
          삭제될 수 있습니다.
        </Caution.SubTitle>
        <Caution.List>
          <Caution.Li>
            개인정보가 포함될 경우 (이름, 전화번호, 주민번호, 아이디 등)
          </Caution.Li>
          <Caution.Li>
            타인의 게시글, 캡처 이미지 등을 무단으로 사용하여 저작권 및 초상권을
            침해하는 경우
          </Caution.Li>
          <Caution.Li>해당 서비스와 관련된 내용이 아닌 경우</Caution.Li>
          <Caution.Li>욕설, 비방 및 도배글, 하위글인 경우</Caution.Li>
          <Caution.Li>광고, 홍보, 판매 등의 내용인 경우</Caution.Li>
          <Caution.Li>부적절한 이미지로 판단될 경우</Caution.Li>
          <Caution.Li>기타 법령에 위반한 경우</Caution.Li>
        </Caution.List>
      </Caution>
      <BottomActionButton type="submit" disabled={!isValid || isPending}>
        {/** TODO: Loading 컴포넌트로 대체 */}
        {isPending ? "기록 중..." : "완료"}
      </BottomActionButton>
    </form>
  );
};

export default CreateRecordForm;
