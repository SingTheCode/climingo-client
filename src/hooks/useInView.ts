import { useEffect, useRef, useState } from "react";

import {
  type ObserverInstanceCallback,
  createObserver,
} from "@/utils/observer";

interface InVeiwOptions extends IntersectionObserverInit {
  initialInView?: boolean;
  onChange?: ObserverInstanceCallback;
}

interface InViewState {
  inView: boolean;
  entry?: IntersectionObserverEntry;
}

const useInView = ({
  root,
  rootMargin,
  threshold,
  initialInView,
  onChange,
}: InVeiwOptions = {}) => {
  const [element, setElement] = useState<Element | null>(null);
  const callback = useRef<InVeiwOptions["onChange"]>();

  const [state, setState] = useState<InViewState>({
    inView: !!initialInView,
    entry: undefined,
  });

  callback.current = onChange;

  useEffect(() => {
    if (!element) return;

    const unobserve = createObserver(
      element,
      (inView, entry) => {
        setState({ inView, entry });

        if (callback.current) {
          callback.current(inView, entry);
        }
      },
      { root, rootMargin, threshold }
    );

    return () => {
      unobserve();
    };
  }, [element, root, rootMargin, threshold]);

  return {
    ref: setElement,
    inView: state.inView,
    entry: state.entry,
  } as {
    ref: (node?: Element | null) => void;
    inView: boolean;
    entry?: IntersectionObserverEntry;
  };
};

export default useInView;
