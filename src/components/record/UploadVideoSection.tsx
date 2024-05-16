"use client";

import { useState } from "react";

import { Heading } from "@/components/record/commonText";
import ClearButton from "./ClearButton";

const UploadVideoSection = () => {
  return (
    <section className="flex flex-col gap-[1.4rem]">
      <Heading text="기록을 위한 동영상을 선택해주세요" />
      <VideoUploader />
    </section>
  );
};

export default UploadVideoSection;

const VideoUploader = () => {
  const [file, setFile] = useState<string>();

  const uploadFile = () => {};

  const clearVideo = () => {
    setFile(undefined);
  };

  return (
    <div className="relative w-[12rem] h-[16rem] rounded-[0.8rem] bg-shadow-lighter hover:bg-shadow-light/30">
      <label
        className={`w-full h-full flex justify-center items-center cursor-pointer`}
        htmlFor="record-video"
      >
        {file ? (
          <video
            src={file}
            controls
            className="w-full h-full rounded-[0.8rem]"
          />
        ) : (
          <img
            src="/icons/icon-photo.svg"
            alt="add-photo-icon"
            width="20"
            height="20"
          />
        )}
        <input
          id="record-video"
          type="file"
          accept="video/*"
          onChange={uploadFile}
          hidden
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
