import axios from "axios";

export const STORAGE_KEY = "x-token";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE,
    withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem(STORAGE_KEY);
    if (token) {
        config.headers.Authorization = "Bearer " + token;
    }
    return config;
});

apiClient.interceptors.response.use((response) => {
    if (response.headers["x-token"]) {
        localStorage.setItem(STORAGE_KEY, response.headers["x-token"]);
        const event = new StorageEvent("storage", { key: STORAGE_KEY });
        window.dispatchEvent(event);
    }

    return response;
});

export default apiClient;
