import axios, { AxiosResponse } from "axios";

const api = axios.create({
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

export const API = {
  get: async <T = unknown>(
    url: string,
    query = {}
  ): Promise<AxiosResponse<T>> => {
    const queryParams = new URLSearchParams(query);
    return await api.get(
      `${url}${Object.keys(query).length > 0 ? "?" + queryParams : ""}`
    );
  },
  post: async <T = unknown>(
    url: string,
    query = {},
    params?: unknown
  ): Promise<AxiosResponse<T>> => {
    const queryParams = new URLSearchParams(query);
    return await api.post(
      `${url}${Object.keys(query).length > 0 ? "?" + queryParams : ""}`,
      params
    );
  },
  put: async <T = unknown>(
    url: string,
    query = {},
    params?: unknown
  ): Promise<AxiosResponse<T>> => {
    const queryParams = new URLSearchParams(query);
    return await api.put(
      `${url}${Object.keys(query).length > 0 ? "?" + queryParams : ""}`,
      params
    );
  },
  delete: async <T = unknown>(
    url: string,
    query = {}
  ): Promise<AxiosResponse<T>> => {
    const queryParams = new URLSearchParams(query);
    return await api.delete(
      `${url}${Object.keys(query).length > 0 ? "?" + queryParams : ""}`
    );
  },
};
