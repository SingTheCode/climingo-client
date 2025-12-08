import { api } from "@/api/axios";

export const getJjikboulDetailApi = async (jjikboulId: string) => {
  const res = await api.get(`/jjikbouls/${jjikboulId}`);
  return res.data;
};

export const createJjikboulApi = async (data: FormData) => {
  const res = await api.post("/jjikbouls", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
