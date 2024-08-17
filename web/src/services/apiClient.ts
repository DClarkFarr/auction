import axios from "axios";

console.log("url was", import.meta.env.VITE_API_BASE);
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE,
    withCredentials: true,
});

export default apiClient;
