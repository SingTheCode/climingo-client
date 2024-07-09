export type ObserverInstanceCallback = (
  inView: boolean,
  entry: IntersectionObserverEntry
) => void;

export const createObserver = (
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
