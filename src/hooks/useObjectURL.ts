import { useEffect, useRef } from "react";

const useObjectURL = () => {
  const savedUrlRef = useRef<string>();

  const revokeUrl = () => {
    if (savedUrlRef.current) {
      URL.revokeObjectURL(savedUrlRef.current);
    }
  };

  const createUrl = (object: Blob | MediaSource) => {
    const url = URL.createObjectURL(object);
    savedUrlRef.current = url;

    return url;
  };

  useEffect(() => revokeUrl, []);

  return { createObjectURL: createUrl, revokeObjectURL: revokeUrl };
};

export default useObjectURL;
