import Layout from "@/shared/components/Layout";
import NavigationHeader from "@/shared/components/NavigationHeader";
import MyProfileDetail from "@/domains/profile/components/MyProfileDetail";

export default function MyProfileDetailPage() {
  return (
    <Layout containHeader>
      <NavigationHeader pageTitle="내 정보" hideHomeButton />
      <MyProfileDetail />
    </Layout>
  );
}
