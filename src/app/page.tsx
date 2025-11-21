import dynamic from "next/dynamic";

const RecordList = dynamic(() => import("@/domains/record/components/RecordList"), {
  ssr: false,
});

export default function Home() {
  return <RecordList />;
}
