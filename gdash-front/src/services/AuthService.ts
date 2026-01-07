// services/userService.ts
import api from "./Api";


export const userService = {
  // GET /api/users/all
  getAll: async () => {
    const response = await api.get("/users/all");
    return response.data;
  },

  // GET /api/users/:id
  getById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // POST /api/users/auth/register
  create: async (data: any) => {
    const response = await api.post("/users/auth/register", data);
    return response.data;
  },

  // PUT /api/users/update/:id
  update: async (id: string, data: any) => {
    const response = await api.put(`/users/update/${id}`, data);
    return response.data;
  },

  // DELETE /api/users/delete/:id
  delete: async (id: string) => {
    const response = await api.delete(`/users/delete/${id}`);
    return response.data;
  }
};
