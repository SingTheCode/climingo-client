"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

/** App Router 글로벌 에러 바운더리 — 캐치되지 않은 에러를 Sentry로 전송 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            gap: "16px",
          }}
        >
          <h2>문제가 발생했습니다</h2>
          <button onClick={() => reset()}>다시 시도</button>
        </div>
      </body>
    </html>
  );
}
