"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { eventEmitter } from "@/utils/eventEmitter";

export default function NavigationHandler() {
  const router = useRouter();

  useEffect(() => {
    const goToSignIn = () => {
      router.replace("signIn");
    };
    eventEmitter.set("unAuthorized", goToSignIn);
    return () => {
      eventEmitter.delete("unAuthorized");
    };
  }, [router]);
  return null;
}
