import { Suspense } from "react";

import OAuth from "@/components/auth/OAuth";

export default function Page() {
  return (
    <Suspense>
      <OAuth />
    </Suspense>
  );
}
