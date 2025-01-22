import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth API
export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await api.post("/auth/login", { username, password });
    return response.data;
  },
};

// Prints API
export const printsAPI = {
  getAllPrints: async () => {
    const response = await api.get("/prints");
    return response.data;
  },
  createPrint: async (printData: any) => {
    const response = await api.post("/prints", printData);
    return response.data;
  },
  updatePrintStatus: async (id: string, status: string) => {
    const response = await api.patch(`/prints/${id}/status`, { status });
    return response.data;
  },
  updatePrintQuantity: async (id: string, quantity: number) => {
    const response = await api.patch(`/prints/${id}/quantity`, { quantity });
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getAllUsers: async () => {
    const response = await api.get("/users");
    return response.data;
  },
  createUser: async (userData: any) => {
    const response = await api.post("/users", userData);
    return response.data;
  },
  deleteUser: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

// Add request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

export default api;
