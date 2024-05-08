"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import { UserState } from "@/types/user";

const UserValueContext = createContext<UserState>({
  isAuthorized: false,
  memberInfo: { nickname: "", authId: "", providerType: "kakao", email: "" },
});
const UserActionsContext = createContext<{ setUser(info: UserState): void }>({
  setUser() {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserInfo] = useState<UserState>({
    isAuthorized: false,
    memberInfo: { nickname: "", authId: "", providerType: "kakao", email: "" },
  });
  const actions = useMemo(
    () => ({
      setUser(info: UserState) {
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
