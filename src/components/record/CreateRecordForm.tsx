"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";

import useCreateRecordMutation from "@/hooks/place/useCreateRecordMutation";

import BottomActionButton from "@/components/common/BottomActionButton";
import SelectPlaceWithLevelSection from "@/components/record/SelectPlaceWithLevelSection";
import UploadVideoSection from "@/components/record/UploadVideoSection";

type FormValues = {
  place?: number;
  level?: number;
  video?: File;
};

const CreateRecordForm = () => {
  const router = useRouter();
  const { mutate: createRecord, isPending } = useCreateRecordMutation();

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    const data = Object.fromEntries(formData) as FormValues;

    // TODO: validation
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
      <SelectPlaceWithLevelSection />
      <UploadVideoSection />
      <BottomActionButton type="submit" disabled={isPending}>
        {/** TODO: Loading 컴포넌트로 대체 */}
        {!isPending ? "완료" : "기록 중..."}
      </BottomActionButton>
    </form>
  );
};

export default CreateRecordForm;
