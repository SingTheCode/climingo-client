import { useCallback } from "react";

const useJjikboulUI = () => {
  const copyToClipboard = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
  }, []);

  const isMobileDevice = useCallback(() => {
    return /Mobi|Android/i.test(navigator.userAgent);
  }, []);

  const isShareAvailable = useCallback(() => {
    return typeof navigator !== "undefined" && "share" in navigator;
  }, []);

  return {
    copyToClipboard,
    isShareAvailable,
    isMobileDevice,
  };
};

export default useJjikboulUI;
