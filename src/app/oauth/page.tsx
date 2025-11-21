import { Suspense } from "react";

import OAuth from "@/domains/auth/components/OAuth";
import Loading from "@/domains/common/components/Loading";

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <OAuth />
    </Suspense>
  );
}
