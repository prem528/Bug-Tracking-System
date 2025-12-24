import api from "@/api/axios";

export const getUsers = async () => {
  const res = await api.get("/api/users");
  return res.data;
};
