import axios from "axios";

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
});

axios.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    console.error("네트워크가 원활하지 않습니다.");
    console.error(error);
  }
);
