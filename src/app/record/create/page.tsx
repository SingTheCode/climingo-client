"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RecordForm } from "@/domains/record/components/RecordForm";
import Layout from "@/components/Layout";
import NavigationHeader from "@/components/NavigationHeader";
import BottomActionButton from "@/components/button/BottomActionButton";
import SelectPlaceWithLevel from "@/domains/record/components/SelectPlaceWithLevel";
import UploadVideo from "@/domains/record/components/UploadVideo";
import Caution from "@/domains/record/components/Caution";

export default function CreateRecordPage() {
  const router = useRouter();
  const [validation, setValidation] = useState({
    level: false,
    video: false,
  });

  const isValid = Object.values(validation).every(Boolean);

  return (
    <Layout containHeader>
      <NavigationHeader hideHomeButton pageTitle="클라이밍 영상 기록하기" />

      <RecordForm>
        <RecordForm.Submit>
          {({ handleSubmit, isUploading, isSuccess }) => {
            const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const gymId = Number(formData.get("place"));
              const levelId = Number(formData.get("level"));

              if (!gymId || !levelId) {
                return;
              }

              handleSubmit({ gymId, levelId });
            };

            if (isSuccess) {
              router.push("/");
            }

            return (
              <form
                className="flex flex-col gap-[3rem] pt-[2rem] pb-[10rem]"
                onSubmit={onSubmit}
              >
                <SelectPlaceWithLevel
                  validate={(valid) =>
                    setValidation({ ...validation, level: valid })
                  }
                />

                <RecordForm.VideoUpload>
                  {() => (
                    <UploadVideo
                      validate={(valid) =>
                        setValidation({ ...validation, video: valid })
                      }
                    />
                  )}
                </RecordForm.VideoUpload>

                <Caution>
                  <Caution.Title>게시글 작성 유의사항</Caution.Title>
                  <Caution.SubTitle>
                    작성된 게시글은 아래와 같은 기준 하에 관리자에 의해 통보
                    없이 임의 삭제될 수 있습니다.
                  </Caution.SubTitle>
                  <Caution.List>
                    <Caution.Li>
                      개인정보가 포함될 경우 (이름, 전화번호, 주민번호, 아이디
                      등)
                    </Caution.Li>
                    <Caution.Li>
                      타인의 게시글, 캡처 이미지 등을 무단으로 사용하여 저작권
                      및 초상권을 침해하는 경우
                    </Caution.Li>
                    <Caution.Li>
                      해당 서비스와 관련된 내용이 아닌 경우
                    </Caution.Li>
                    <Caution.Li>욕설, 비방 및 도배글, 하위글인 경우</Caution.Li>
                    <Caution.Li>광고, 홍보, 판매 등의 내용인 경우</Caution.Li>
                    <Caution.Li>부적절한 이미지로 판단될 경우</Caution.Li>
                    <Caution.Li>기타 법령에 위반한 경우</Caution.Li>
                  </Caution.List>
                </Caution>

                <BottomActionButton
                  type="submit"
                  disabled={!isValid || isUploading}
                >
                  {isUploading ? "기록 중..." : "완료"}
                </BottomActionButton>
              </form>
            );
          }}
        </RecordForm.Submit>
      </RecordForm>
    </Layout>
  );
}
