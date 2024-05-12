import Avatar from "@/components/common/Avatar";
import GradeIcon from "@/components/common/GradeIcon";

export default function RecordDetail() {
  return (
    // TODO: Layout 컴포넌트 적용
    <div className="w-full h-[80%] flex flex-col">
      <UserInfo />
      <RecordInfo />
    </div>
  );
}

const UserInfo = () => {
  return (
    <div className="flex">
      <Avatar size="sm" src="/assets/yellow-boulder.svg" alt="유저정보" />
      <div className="flex flex-col justify-between h-[4rem] pl-[1rem]">
        <span className="font-bold">종근꽈당약국</span>
        <span className="text-sm text-shadow ">10분 전</span>
      </div>
    </div>
  );
};

const RecordInfo = () => {
  return (
    <div className="h-full pt-[2rem]">
      <div className="flex">
        <span className="px-[1.2rem] py-[0.6rem] mr-[0.5rem] bg-shadow-lighter rounded-xl text-sm">
          더클라임 연남점
        </span>
        <div className="flex items-center px-[1.2rem] py-[0.6rem] mr-[0.5rem] bg-shadow-lighter rounded-xl text-sm">
          <span>하양</span>
          <div className="pl-[0.5rem]">
            <GradeIcon color="white" />
          </div>
        </div>
      </div>
      <video controls className="w-full h-full mt-[1rem] rounded-2xl">
        <source src="" type="video/mp4" />
      </video>
    </div>
  );
};
