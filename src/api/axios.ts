import axios from "axios";
import mitt from "mitt";

import { authStorage } from "@/utils/webStorage";

export const emitter = mitt();

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
        authStorage.remove();
        emitter.emit("unAuthorized");
      }
    }
    return Promise.reject(error);
  }
);
