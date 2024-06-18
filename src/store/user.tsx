"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

import { MemberInfo } from "@/types/user";

const UserValueContext = createContext<MemberInfo | null>(null);
const UserActionsContext = createContext<{ setUser(info: MemberInfo): void }>({
  setUser() {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserInfo] = useState<MemberInfo | null>(null);
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
