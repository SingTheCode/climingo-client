import axios from "axios";

import { eventEmitter } from "@/utils/eventEmitter";
import useUserStore from "@/store/user";

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        useUserStore.getState().clearUser();
        eventEmitter.emit("unAuthorized");
      }
    }
    return Promise.reject(error);
  }
);
