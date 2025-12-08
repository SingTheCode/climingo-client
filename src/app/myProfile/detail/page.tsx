import Layout from "@/components/common/Layout";
import NavigationHeader from "@/components/common/NavigationHeader";
import MyProfileDetail from "@/domains/profile/components/MyProfileDetail";

export default function MyProfileDetailPage() {
  return (
    <Layout containHeader>
      <NavigationHeader pageTitle="내 정보" hideHomeButton />
      <MyProfileDetail />
    </Layout>
  );
}
