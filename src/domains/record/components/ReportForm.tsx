import { FormEvent } from "react";
import Image from "next/image";
import {
  Field,
  Fieldset,
  Label,
  Legend,
  Radio,
  RadioGroup,
} from "@headlessui/react";

import type { RecordReportApiRequest } from "@/domains/record/types/record";

import { reportRecordApi } from "@/domains/record/api/record";
import BottomActionButton from "@/shared/components/BottomActionButton";
import useReportReasonQuery from "@/domains/record/hooks/useReportReasonQuery";

type ReportFormType = {
  recordId: string;
  onSubmitSuccess?: () => void;
  onSubmitError?: () => void;
};

const ReportForm = ({
  recordId,
  onSubmitSuccess,
  onSubmitError,
}: ReportFormType) => {
  const { data: reason, isSuccess: isReasonQuerySuccess } =
    useReportReasonQuery();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const reportData = Object.fromEntries(
      formData
    ) as unknown as RecordReportApiRequest;

    try {
      await reportRecordApi(recordId, reportData);
      onSubmitSuccess?.();
    } catch {
      onSubmitError?.();
    }
  };

  return (
    <form
      className="flex flex-col gap-[2rem] py-[3rem]"
      onSubmit={handleSubmit}
    >
      {isReasonQuerySuccess && (
        <>
          <Fieldset>
            <RadioGroup
              name="reasonCode"
              defaultValue={reason[0]["code"]}
              className="flex flex-col gap-[2rem]"
            >
              <Legend className="text-base font-medium">신고 유형</Legend>

              {reason.map(({ code, description }) => (
                <Field key={code}>
                  <Radio
                    value={code}
                    className="group flex gap-[1rem] cursor-pointer"
                  >
                    <span className="w-[2rem] h-[2rem] rounded-full border-shadow border-[0.1rem] group-data-[checked]:bg-primary group-data-[checked]:border-primary bg-[url(/icons/icon-check.svg)] bg-no-repeat bg-center"></span>
                    <Label>{description}</Label>
                  </Radio>
                </Field>
              ))}
            </RadioGroup>
          </Fieldset>

          <section className="flex gap-[0.5rem] items-start">
            <Image
              src="/icons/icon-info.svg"
              width={18}
              height={18}
              alt="information"
            />
            <p className=" text-sm text-shadow">
              신고된 내용은 내부 정책에 의거하여 최대 24시간 이내에 조치될
              예정입니다.
            </p>
          </section>
        </>
      )}

      <BottomActionButton type="submit">제출하기</BottomActionButton>
    </form>
  );
};

export default ReportForm;
