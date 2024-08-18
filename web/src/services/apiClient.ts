import axios from "axios";

console.log("url was", import.meta.env.VITE_API_BASE);
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE,
    withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("x-token");
    if (token) {
        config.headers.Authorization = "Bearer " + token;
    }
    return config;
});

apiClient.interceptors.response.use((response) => {
    if (response.headers["x-token"]) {
        localStorage.setItem("x-token", response.headers["x-token"]);
    }

    return response;
});

export default apiClient;
