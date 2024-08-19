import axios from "axios";

export const STORAGE_KEY = "x-token";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE,
    withCredentials: true,
});

export default apiClient;
