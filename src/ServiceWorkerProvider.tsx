"use client";

import { ReactNode, useEffect } from "react";

const ServiceWorkerProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const registerServiceWorker = async () => {
        const registration = await navigator.serviceWorker.register("/sw.js");
        registration.waiting?.postMessage("SKIP_WAITING");
      };

      registerServiceWorker();
    }
  }, []);

  return children;
};

export default ServiceWorkerProvider;
