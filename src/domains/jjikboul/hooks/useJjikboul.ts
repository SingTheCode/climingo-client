import { useCallback } from 'react';
import type { JjikboulDetail } from '@/domains/jjikboul/types/entity';

export const useJjikboul = () => {
  const getShareUrl = useCallback((): string => {
    return window.location.href;
  }, []);

  const validateJjikboulData = useCallback((data: JjikboulDetail): boolean => {
    if (!data.jjikboul?.jjikboulId) return false;
    if (!data.memberInfo?.nickname) return false;
    if (!data.gym?.name) return false;
    if (!data.level?.name) return false;
    return true;
  }, []);

  return {
    getShareUrl,
    validateJjikboulData,
  };
};
