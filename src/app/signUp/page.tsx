import Layout from "@/components/common/Layout";
import NavigationHeader from "@/components/common/NavigationHeader";
import SignUp from "@/app/signUp/SignUp";

export default function Page() {
  return (
    <Layout containHeader>
      <NavigationHeader />
      <SignUp />
    </Layout>
  );
}
