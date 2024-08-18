import { User } from "../types/User";
import apiClient from "./apiClient";

export default class UserService {
    static login(email: string, password: string) {
        return apiClient
            .post<User>("/user/login", { email, password })
            .then((res) => res.data);
    }
    static register(email: string, password: string, token: string) {
        return apiClient
            .post<User>("/user/register", { email, password, token })
            .then((res) => res.data);
    }
    static logout() {
        return apiClient.post("/user/logout");
    }

    static me() {
        return apiClient.get<User>("/user").then((res) => res.data);
    }
}
