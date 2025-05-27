"use client";

import { useRouter } from "next/navigation";

import { emitter } from "@/api/axios";

export default function NavigationHandler() {
  const router = useRouter();

  const goToSignIn = () => {
    router.replace("signIn");
  };
  emitter.on("unAuthorized", goToSignIn);

  return null;
}
