import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";
import "@/types/common";
import "@/utils/common";
import ReactQueryProvider from "@/reactQueryProvider";
import { UserProvider } from "@/store/user";

/** https://github.com/orioncactus/pretendard?tab=readme-ov-file#nextjs */
const pretendard = localFont({
  src: "./PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
});

export const metadata: Metadata = {
  title: "Climingo",
  description: "클라이밍을 재밌게 해봐요!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={pretendard.className}>
        <ReactQueryProvider>
          <UserProvider>{children}</UserProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
