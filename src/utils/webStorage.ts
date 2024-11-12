import { MEMBER_INFO_STORAGE_KEY } from "@/constants/key";

const authStorageKey = MEMBER_INFO_STORAGE_KEY;

export const authStorage = {
  get: () => localStorage.getItem(authStorageKey),
  set: (data: string) => localStorage.setItem(authStorageKey, data),
  remove: () => localStorage.removeItem(authStorageKey),
};
