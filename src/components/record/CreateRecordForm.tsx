"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import useCreateRecordMutation from "@/hooks/place/useCreateRecordMutation";

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
  const { mutate: createRecord, isPending } = useCreateRecordMutation();

  const [validation, setValidation] = useState({
    level: false,
    video: false,
  });

  const isValid = Object.values(validation).every(Boolean);

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    const data = Object.fromEntries(formData) as FormValues;

    if (!data.place || !data.level || !data.video) {
      return;
    }

    createRecord(
      { gymId: data.place, levelId: data.level, video: data.video },
      {
        onSuccess: ({ recordId }) => {
          router.push(`/record/${recordId}`);
        },
      }
    );
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
