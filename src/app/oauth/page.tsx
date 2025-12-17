import { Suspense } from "react";

import Loading from "@/components/Loading";

import { OAuth } from "@/domains/auth/components/OAuth";

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <OAuth />
    </Suspense>
  );
}
