import Layout from "@/components/common/Layout";
import AuthRequired from "@/components/common/AuthRequired";
import NavigationHeader from "@/components/common/NavigationHeader";
import MyProfileDetail from "@/components/profile/MyProfileDetail";

export default function MyProfileDetailPage() {
  return (
    <Layout containHeader>
      <NavigationHeader pageTitle="내 정보" hideHomeButton />
      <AuthRequired>
        <MyProfileDetail />
      </AuthRequired>
    </Layout>
  );
}
