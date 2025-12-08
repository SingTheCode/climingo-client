import { useCallback } from "react";
import { useRouter } from "next/navigation";

import { loginCheck } from "@/shared/utils/common";

type NavigateCallback = () => void;

export const useNavigateWithAuth = () => {
  const router = useRouter();

  return useCallback(
    (path: string, onNavigate?: NavigateCallback) => {
      if (loginCheck()) {
        router.push(path);
        onNavigate?.();
      }
    },
    [router]
  );
};
