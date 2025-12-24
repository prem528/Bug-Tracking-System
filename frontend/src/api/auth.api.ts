import api from "./axios";

export const loginApi = (data: {
  email: string;
  password: string;
}) => api.post("/api/auth/login", data);

export const registerApi = (data: {
  name: string;
  email: string;
  password: string;
  adminSecret?: string;
}) => api.post("/api/auth/register", data);
