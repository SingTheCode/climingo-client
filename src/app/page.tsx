import dynamic from "next/dynamic";

const RecordList = dynamic(() => import("@/components/record/RecordList"), {
  ssr: false,
});

export default function Home() {
  return <RecordList />;
}
