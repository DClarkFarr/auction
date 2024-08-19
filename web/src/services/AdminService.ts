import { User } from "../types/User";
import apiClient from "./apiClient";

export default class AdminService {
    static getUsers() {
        return apiClient.get<User[]>("/admin/users").then((res) => res.data);
    }
}
