// 빌드 시 prerender에서 API fetch 실패 방지 (api.climingo.xyz DNS 미해석)
export const dynamic = "force-dynamic";

import HomePage from "@/app/HomePage";

export default function Page() {
  return <HomePage />;
}
