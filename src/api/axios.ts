import axios, { AxiosResponse } from "axios";

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
});

export const API = {
  get: async <T = any>(url: string, query = {}): Promise<AxiosResponse<T>> => {
    query = new URLSearchParams(query);
    return await api.get(`${url}${Object.keys(query) > 0 ? "?" + query : ""}`);
  },
  post: async <T = any>(
    url: string,
    query = {},
    params?: any
  ): Promise<AxiosResponse<T>> => {
    query = new URLSearchParams(query);
    return await api.post(
      `${url}${Object.keys(query) > 0 ? "?" + query : ""}`,
      params
    );
  },
  put: async <T = any>(
    url: string,
    query = {},
    params?: any
  ): Promise<AxiosResponse<T>> => {
    query = new URLSearchParams(query);
    return await api.put(
      `${url}${Object.keys(query) > 0 ? "?" + query : ""}`,
      params
    );
  },
  delete: async <T = any>(
    url: string,
    query = {}
  ): Promise<AxiosResponse<T>> => {
    query = new URLSearchParams(query);
    return await api.delete(
      `${url}${Object.keys(query) > 0 ? "?" + query : ""}`
    );
  },
};
