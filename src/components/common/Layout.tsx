import { PropsWithChildren } from "react";

type LayoutProps = {
  containHeader?: boolean;
};

const Layout = ({
  containHeader,
  children,
}: PropsWithChildren<LayoutProps>) => {
  return (
    <main
      className={`px-[2rem] ${containHeader ? "pt-[4.8rem]" : "pt-[2rem]"}`}
    >
      {children}
    </main>
  );
};

export default Layout;
