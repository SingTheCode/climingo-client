import { MEMBER_INFO_STORAGE_KEY } from "@/constants/key";

const authStorageKey = MEMBER_INFO_STORAGE_KEY;

export const authStorage = {
  get: () => sessionStorage.getItem(authStorageKey),
  set: (data: string) => sessionStorage.setItem(authStorageKey, data),
  remove: () => sessionStorage.removeItem(authStorageKey),
};
