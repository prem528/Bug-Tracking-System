import api from "@/api/axios";

export const getTicketsByProject = async (projectId: string) => {
  const res = await api.get(`/api/tickets?projectId=${projectId}`);
  return { tickets: res.data.tickets, total: res.data.total };
};


// UPDATE TICKET
export const updateTicket = async (
  ticketId: string,
  data: Partial<{ 
    title: string; 
    description: string; 
    status: string; 
    priority: string; 
    assignedTo: string;
  }>
) => {
  const res = await api.put(`/api/tickets/${ticketId}`, data);
  return res.data;
};

// CREATE TICKET
export const createTicket = async (data: {
  title: string;
  description: string;
  priority: string;
  project: string;
  assignedTo: string;
}) => {
  const res = await api.post("/api/tickets", data);
  return res.data;
};
