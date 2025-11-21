import Layout from "@/domains/common/components/Layout";
import NavigationHeader from "@/domains/common/components/NavigationHeader";
import MyProfileDetail from "@/domains/user/components/profile/MyProfileDetail";

export default function MyProfileDetailPage() {
  return (
    <Layout containHeader>
      <NavigationHeader pageTitle="내 정보" hideHomeButton />
      <MyProfileDetail />
    </Layout>
  );
}
