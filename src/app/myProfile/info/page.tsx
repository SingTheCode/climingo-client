import Layout from "@/components/common/Layout";
import AuthRequired from "@/components/common/AuthRequired";
import NavigationHeader from "@/components/common/NavigationHeader";
import MyProfileInfo from "@/components/profile/MyProfileInfo";

export default function MyProfileInfoPage() {
  return (
    <Layout containHeader>
      <NavigationHeader pageTitle="내 정보" hideHomeButton />
      <AuthRequired>
        <MyProfileInfo />
      </AuthRequired>
    </Layout>
  );
}
