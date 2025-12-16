"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { MemberInfo } from '@/domains/auth/types/entity';

interface UserStore {
  user: MemberInfo | null;
  setUser: (info: MemberInfo) => void;
  clearUser: () => void;
}

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (info: MemberInfo) => {
        set({ user: info });
      },
      clearUser: () => {
        set({ user: null });
      },
    }),
    {
      name: "user-store",
    }
  )
);

export default useUserStore;
