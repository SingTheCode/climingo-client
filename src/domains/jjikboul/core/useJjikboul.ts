import { useCallback } from "react";
import { JjikboulDetail } from "@/domains/jjikboul/types/jjikboul";

const useJjikboul = () => {
  const getShareUrl = useCallback((): string => {
    return window.location.href;
  }, []);

  const validateJjikboulData = useCallback((data: JjikboulDetail): boolean => {
    if (!data.jjikboul?.jjikboulId) return false;
    if (!data.memberInfo?.nickname) return false;
    if (!data.gym?.gymName) return false;
    if (!data.level?.colorNameKo) return false;
    return true;
  }, []);

  return {
    getShareUrl,
    validateJjikboulData,
  };
};

export default useJjikboul;
