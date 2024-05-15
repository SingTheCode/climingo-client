import Layout from "@/components/common/Layout";
import NavigationHeader from "@/components/common/NavigationHeader";
import { CreateRecordForm } from "@/components/record/create/Form";

export default function CreateRecordPage() {
  return (
    <Layout containHeader>
      <NavigationHeader hideHomeButton pageTitle="클라이밍 영상 기록하기" />
      <CreateRecordForm />
    </Layout>
  );
}
