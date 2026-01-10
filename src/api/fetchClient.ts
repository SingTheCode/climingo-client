import { eventEmitter } from "@/utils/eventEmitter";

import useUserStore from "@/store/user";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class FetchError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "FetchError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    if (response.status === 401) {
      useUserStore.getState().clearUser();
      eventEmitter.emit("unAuthorized");
    }
    throw new FetchError(response.status, response.statusText);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export const api = {
  async get<T, P = Record<string, unknown>>(
    endpoint: string,
    options?: { params?: P }
  ): Promise<T> {
    const url = new URL(`${BASE_URL}${endpoint}`);
    if (options?.params) {
      Object.entries(options.params as Record<string, unknown>).forEach(
        ([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, String(value));
          }
        }
      );
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    return handleResponse<T>(response);
  },

  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(response);
  },

  async put<T>(endpoint: string, body?: unknown): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(response);
  },

  async patch<T>(endpoint: string, body?: unknown): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(response);
  },

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    return handleResponse<T>(response);
  },
};

// Presigned URL 업로드용 (외부 URL, credentials 불필요)
export async function uploadToPresignedUrl(
  url: string,
  file: File
): Promise<void> {
  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!response.ok) {
    throw new FetchError(response.status, "파일 업로드에 실패했습니다.");
  }
}
