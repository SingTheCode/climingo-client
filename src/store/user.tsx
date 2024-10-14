"use client";

import { createContext, useContext, useMemo, useState } from "react";

import type { MemberInfo } from "@/types/auth";

const UserValueContext = createContext<MemberInfo | null>(null);
const UserActionsContext = createContext<{ setUser(info: MemberInfo): void }>({
  setUser() {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserInfo] = useState<MemberInfo | null>(() => {
    try {
      // TODO: useAuthSession hook 사용하도록 수정
      return JSON.parse(
        sessionStorage.getItem("memberInfo") || ""
      ) as MemberInfo;
    } catch {
      return null;
    }
  });

  const actions = useMemo(
    () => ({
      setUser(info: MemberInfo) {
        setUserInfo(info);
      },
    }),
    []
  );

  return (
    <UserActionsContext.Provider value={actions}>
      <UserValueContext.Provider value={user}>
        {children}
      </UserValueContext.Provider>
    </UserActionsContext.Provider>
  );
}

export function useUserValue() {
  const value = useContext(UserValueContext);
  if (value === undefined) {
    throw new Error("UserContext is undefined");
  }
  return value;
}

export function useUserActions() {
  const value = useContext(UserActionsContext);
  if (value === undefined) {
    throw new Error("UserContext is undefined");
  }
  return value;
}
