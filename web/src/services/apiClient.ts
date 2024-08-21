import axios from "axios";

export const STORAGE_KEY = "x-token";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE,
    withCredentials: true,
    // headers: {
    //     "Content-Type": "application/json",
    // },
});

export default apiClient;
