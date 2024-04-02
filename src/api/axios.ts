import axios from "axios";

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
});

// 응답 인터셉터
api.interceptors.response.use((res) => {
  return res;
});
