import Layout from "@/components/common/Layout";
import NavigationHeader from "@/components/common/NavigationHeader";
import CreateRecordForm from "@/domains/record/components/CreateRecordForm";

export default function CreateRecordPage() {
  return (
    <Layout containHeader>
      <NavigationHeader hideHomeButton pageTitle="클라이밍 영상 기록하기" />
      <CreateRecordForm />
    </Layout>
  );
}
