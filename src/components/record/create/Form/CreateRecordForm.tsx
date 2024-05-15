import BottomActionButton from "@/components/common/BottomActionButton";
import SelectPlaceWithLevelSection from "./SelectPlaceWithLevelSection";
import UploadVideoSection from "./UploadVideoSection";

const CreateRecordForm = () => {
  return (
    <form className="flex flex-col gap-[3rem] pt-[2rem]">
      <SelectPlaceWithLevelSection />
      <UploadVideoSection />
      <BottomActionButton>완료</BottomActionButton>
    </form>
  );
};

export default CreateRecordForm;
