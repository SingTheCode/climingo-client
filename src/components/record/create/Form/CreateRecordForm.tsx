import BottomActionButton from "@/components/common/BottomActionButton";
import SelectPlaceWithLevelSection from "./SelectPlaceWithLevelSection";
import UploadVideoSection from "./UploadVideoSection";

const CreateRecordForm = () => {
  return (
    <form className="flex flex-col p-[2rem] pt-[4rem] gap-[3rem]">
      <SelectPlaceWithLevelSection />
      <UploadVideoSection />
      <BottomActionButton>완료</BottomActionButton>
    </form>
  );
};

export default CreateRecordForm;
