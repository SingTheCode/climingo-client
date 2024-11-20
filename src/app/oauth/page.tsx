import { Suspense } from "react";

import OAuth from "@/components/auth/OAuth";
import Loading from "@/components/common/Loading";

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <OAuth />
    </Suspense>
  );
}
