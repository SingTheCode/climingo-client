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

import { reportRecordApi } from "@/api/modules/record";
import BottomActionButton from "@/components/common/BottomActionButton";

const ReportType = [
  {
    code: "01",
    description: "서비스와 관련없는 영상입니다.",
  },
  {
    code: "02",
    description: "음란, 욕설, 비방 내용입니다.",
  },
  {
    code: "03",
    description: "개인의 광고나 홍보성 내용입니다.",
  },
  {
    code: "04",
    description: "개인정보 유출의 위험이 있습니다.",
  },
  {
    code: "05",
    description: "게시글을 도배했습니다.",
  },
  {
    code: "06",
    description: "저작권이나 초상권을 침해한 영상입니다.",
  },
] as const;

export interface RecordReportApiRequest {
  reasonCode: (typeof ReportType)[number]["code"];
}

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
      <Fieldset>
        <RadioGroup
          name="reasonCode"
          defaultValue={ReportType[0]["code"]}
          className="flex flex-col gap-[2rem]"
        >
          <Legend className="text-base font-medium">신고 유형</Legend>

          {ReportType.map(({ code, description }) => (
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

      <BottomActionButton type="submit">제출하기</BottomActionButton>
    </form>
  );
};

export default ReportForm;
