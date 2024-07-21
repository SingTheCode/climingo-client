import { MEMBER_INFO_STORAGE_KEY } from "@/constants/key";

export const webStorage = (key: string) => ({
  get: () => sessionStorage.getItem(key),
  set: (data: string) => sessionStorage.setItem(key, data),
  remove: () => sessionStorage.removeItem(key),
});

export const authStorage = webStorage(MEMBER_INFO_STORAGE_KEY);
