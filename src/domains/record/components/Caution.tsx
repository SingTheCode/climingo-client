import { ReactNode } from "react";

const CautionMain = ({ children }: { children: ReactNode }) => {
  return <div className="flex flex-col gap-[1.4rem] pt-[4rem]">{children}</div>;
};

const CautionTitle = ({ children }: { children: ReactNode }) => {
  return <h3 className="text-base font-semibold pl-[0.2rem]">{children}</h3>;
};

const CautionSubTitle = ({ children }: { children: ReactNode }) => {
  return (
    <h4 className="text-sm font-semibold pl-[0.2rem] pt-[0.5rem]">
      {children}
    </h4>
  );
};

const CautionList = ({ children }: { children: ReactNode }) => {
  return <ul className="flex flex-col gap-[0.8rem]">{children}</ul>;
};

const CautionLi = ({ children }: { children: ReactNode }) => {
  return <li className="text-sm text-shadow-dark pl-[0.2rem]">- {children}</li>;
};

const Caution = Object.assign(CautionMain, {
  Title: CautionTitle,
  SubTitle: CautionSubTitle,
  Li: CautionLi,
  List: CautionList,
});

export default Caution;
