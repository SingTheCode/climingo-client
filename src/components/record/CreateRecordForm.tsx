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
      const { presignedUrl, videoUrl } = await getPresignedUrlApi({
        fileName: formValues.video.name.split(".")[0],
        extension: formValues.video.type.split("/")[1],
      });
      await uploadVideoApi({
        presignedUrl,
        file: formValues.video,
      });
      const { recordId } = await createRecordApi({
        gymId: formValues.place,
        levelId: formValues.level,
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
      className="flex flex-col gap-[3rem] pt-[2rem]"
      onSubmit={handleFormSubmit}
    >
      <SelectPlaceWithLevel
        validate={(valid) => setValidation({ ...validation, level: valid })}
      />
      <UploadVideo
        validate={(valid) => setValidation({ ...validation, video: valid })}
      />
      <BottomActionButton type="submit" disabled={!isValid || isPending}>
        {/** TODO: Loading 컴포넌트로 대체 */}
        {isPending ? "기록 중..." : "완료"}
      </BottomActionButton>
    </form>
  );
};

export default CreateRecordForm;
