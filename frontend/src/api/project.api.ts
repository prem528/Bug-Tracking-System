import api from "@/api/axios";

export const getProjects = async () => {
  const res = await api.get("/api/projects");
  return { projects: res.data.projects, total: res.data.total };
};

export const createProject = async (data: {
  name: string;
  description: string;
}) => {
  const res = await api.post("/api/projects", data);
  return res.data;
};
