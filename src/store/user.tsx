"use client";

import { create } from "zustand";

import type { MemberInfo } from "@/types/auth";

interface UserStore {
  user: MemberInfo | null;
  setUser: (info: MemberInfo) => void;
  clearUser: () => void;
}

const useUserStore = create<UserStore>((set) => ({
  user: (() => {
    try {
      // TODO: useAuthSession hook 사용하도록 수정
      const storedValue = localStorage.getItem("memberInfo");
      if (!storedValue) return null;
      return JSON.parse(storedValue) as MemberInfo;
    } catch {
      return null;
    }
  })(),
  setUser: (info: MemberInfo) => {
    set({ user: info });
    localStorage.setItem("memberInfo", JSON.stringify(info));
  },
  clearUser: () => {
    set({ user: null });
    localStorage.removeItem("memberInfo");
  },
}));

export default useUserStore;
