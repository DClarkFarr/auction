import { ResetPasswordState } from "../components/user/ResetPasswordForm";
import { PaymentMethod } from "../stores/useUserStore";
import { RegisterPayload, User } from "../types/User";
import apiClient from "./apiClient";

export default class UserService {
    static login(email: string, password: string) {
        return apiClient
            .post<{ user: User; paymentMethod: PaymentMethod }>("/user/login", {
                email,
                password,
            })
            .then(({ data }) => data);
    }

    static changeUserPassword(idUser: number, state: ResetPasswordState) {
        return apiClient.post(`/user/${idUser}/password`, state).then(() => {});
    }
    static register(data: RegisterPayload) {
        return apiClient
            .post<{ user: User }>("/user/register", data)
            .then((res) => res.data.user);
    }
    static logout() {
        return apiClient.post("/user/logout");
    }

    static me() {
        return apiClient
            .get<{ user: User; paymentMethod: PaymentMethod }>("/user")
            .then((res) => res.data);
    }
}
