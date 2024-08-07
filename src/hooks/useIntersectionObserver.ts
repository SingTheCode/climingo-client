import { useEffect, useRef, useState } from "react";

type ObserverInstanceCallback = (
  inView: boolean,
  entry: IntersectionObserverEntry
) => void;

interface ObserverOptions extends IntersectionObserverInit {
  initialInView?: boolean;
  onChange?: ObserverInstanceCallback;
}

interface InViewState {
  inView: boolean;
  entry?: IntersectionObserverEntry;
}

const useIntersectionObserver = ({
  root,
  rootMargin,
  threshold,
  initialInView,
  onChange,
}: ObserverOptions = {}) => {
  const [element, setElement] = useState<Element>();
  const callback = useRef<ObserverOptions["onChange"]>();

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

export default useIntersectionObserver;

/*
 * IntersectionObserver 인스턴스를 생성하고, unobserve 함수를 반환합니다.
 */
const createObserver = (
  element: Element,
  callback: ObserverInstanceCallback,
  options: IntersectionObserverInit = {}
) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const inView = entry.isIntersecting;
      callback(inView, entry);
    });
  }, options);

  observer.observe(element);

  /*
   * unobserve
   */
  return () => {
    observer.unobserve(element);
    observer.disconnect();
  };
};
