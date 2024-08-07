import { useCallback } from "react";

import { MemberInfo } from "@/types/user";
import { authStorage } from "@/utils/webStorage";

const useAuthSession = () => {
  const get = useCallback(() => {
    try {
      const data = authStorage.get();

      if (!data) {
        return undefined;
      }

      return JSON.parse(data) as MemberInfo;
    } catch {
      return undefined;
    }
  }, []);

  const set = useCallback((data: MemberInfo) => {
    authStorage.set(JSON.stringify(data));
  }, []);

  const remove = useCallback(() => {
    authStorage.remove();
  }, []);

  return { get, set, remove };
};

export default useAuthSession;
