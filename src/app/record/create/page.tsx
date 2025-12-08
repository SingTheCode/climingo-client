import Layout from "@/shared/components/Layout";
import NavigationHeader from "@/shared/components/NavigationHeader";
import CreateRecordForm from "@/domains/record/components/CreateRecordForm";

export default function CreateRecordPage() {
  return (
    <Layout containHeader>
      <NavigationHeader hideHomeButton pageTitle="클라이밍 영상 기록하기" />
      <CreateRecordForm />
    </Layout>
  );
}
