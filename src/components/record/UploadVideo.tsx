"use client";

import Image from "next/image";
import { ChangeEventHandler, memo, useRef, useState } from "react";

import useObjectURL from "@/hooks/useObjectURL";

import { Heading } from "@/components/record/commonText";
import ClearButton from "@/components/record/ClearButton";

const UploadVideo = memo(
  ({ validate }: { validate?: (valid: boolean) => void }) => {
    const validateOnVideoChange = (file?: File) => {
      const isValidFile = !!file;
      validate && validate(isValidFile);
    };

    return (
      <section className="flex flex-col gap-[1.4rem]">
        <Heading text="기록을 위한 동영상을 선택해주세요" />
        <VideoUploader onChange={validateOnVideoChange} />
      </section>
    );
  }
);

UploadVideo.displayName = "UploadVideo";

export default UploadVideo;

const VideoUploader = ({ onChange }: { onChange?: (file?: File) => void }) => {
  const [file, setFile] = useState<string>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { createObjectURL: crateVideoURL, revokeObjectURL: revokeVideoURL } =
    useObjectURL();

  const uploadFile: ChangeEventHandler<HTMLInputElement> = (event) => {
    const files = event.target.files;

    if (!files || files.length === 0) {
      return;
    }

    const nextFile = files[0];
    // video 시작 시간을 0.5초 설정 후 미리 메타데이터를 로드하여 썸네일 표시
    const url = crateVideoURL(nextFile) + "#t=0.5";

    setFile(url);
    onChange?.(nextFile);
  };

  const clearVideo = () => {
    revokeVideoURL();
    setFile(undefined);
    onChange?.(undefined);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="relative w-[12rem] h-[16rem] rounded-[0.8rem] bg-shadow-lighter hover:bg-shadow-light/30">
      <label
        className={`w-full h-full flex justify-center items-center cursor-pointer`}
        htmlFor="record-video"
      >
        {file ? (
          <video
            src={file + "#t0.001"}
            className="w-full h-full rounded-[0.8rem]"
          />
        ) : (
          <Image
            src="/icons/icon-photo.svg"
            alt="add-photo-icon"
            width="20"
            height="20"
          />
        )}
        <input
          id="record-video"
          name="video"
          type="file"
          accept="video/*"
          onChange={uploadFile}
          hidden
          ref={fileInputRef}
        />
      </label>
      {file && (
        <ClearButton
          className="absolute top-0 right-0 p-2"
          onClick={clearVideo}
        />
      )}
    </div>
  );
};
