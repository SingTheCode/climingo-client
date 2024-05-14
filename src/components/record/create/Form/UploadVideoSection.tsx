import { Heading } from "@/components/record/create/common";
import { VideoUploader } from "@/components/record/create/selectors";

const UploadVideoSection = () => {
  return (
    <section className="flex flex-col gap-[1.4rem]">
      <Heading text="기록을 위한 동영상을 선택해주세요" />
      <VideoUploader />
    </section>
  );
};

export default UploadVideoSection;
