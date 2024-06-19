import axios from "axios";

import { loginCheck } from "@/utils/common";

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
});

axios.interceptors.response.use(
  (res) => {
    // 401 unauthorized
    if (res.status === 401) {
      sessionStorage.removeItem("memberInfo");
      if (!loginCheck()) {
        location.href = "/";
      }
    }
    return res;
  },
  (error) => {
    console.error("네트워크가 원활하지 않습니다.");
    console.error(error);
  }
);
