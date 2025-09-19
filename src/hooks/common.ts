import {
  DependencyList,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";

import { loginCheck } from "@/utils/common";

export const useDebounce = <T = unknown>(value: T, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useDidMountEffect = (
  callback = () => {},
  deps: DependencyList
) => {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) {
      callback();
      return;
    }
    didMount.current = true;
  }, deps);
};

export const useRunOnce = (callback: () => void) => {
  const triggered = useRef(false);

  useEffect(() => {
    if (!triggered.current) {
      callback();
      triggered.current = true;
    }
  }, [callback]);
};

type NavigateCallback = () => void;

export const useNavigateWithAuth = () => {
  const router = useRouter();

  const navigate = useCallback(
    (path: string, onNavigate?: NavigateCallback) => {
      if (loginCheck()) {
        router.push(path);
        onNavigate?.();
      }
    },
    [router]
  );

  return navigate;
};
