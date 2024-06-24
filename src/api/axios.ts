import axios, { isAxiosError } from "axios";

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    console.error(error);

    // TODO: 서버 CORS 에러 해결 후 401 에러인 경우에만 memberInfo 제거
    // CORS로 인해 error response가 전달되지 않고 있어서, 우선은 axios error이면 스토리지에 저장된 memberInfo를 제거해요
    if (isAxiosError(error)) {
      const hasMemberInfo = sessionStorage.getItem("memberInfo");

      if (hasMemberInfo) {
        sessionStorage.removeItem("memberInfo");
        location.reload();
      }
    }
  }
);
