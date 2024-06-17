import Link from "next/link";
import Layout from "@/components/common/Layout";
import NavigationHeader from "@/components/common/NavigationHeader";
import SignUp from "@/components/auth/SignUp";

export default function Page() {
  return (
    <Layout containHeader>
      <NavigationHeader
        pageTitle="회원가입"
        hideBackButton
        hideHomeButton
        leftElement={
          <Link href="/signIn">
            <button className="text-shadow-dark">취소</button>
          </Link>
        }
      />
      <SignUp />
    </Layout>
  );
}
