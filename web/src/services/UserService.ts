import { ResetPasswordState } from "../components/user/ResetPasswordForm";
import { PaymentMethod } from "../stores/useUserStore";
import { PaginatedResults } from "../types/Paginate";
import { FullProductItem } from "../types/Product";
import { RegisterPayload, User, UserFavorite } from "../types/User";
import apiClient from "./apiClient";
import { PaginatedProductParams } from "./SiteService";

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

    static getUserFavorites() {
        return apiClient
            .get<UserFavorite[]>("/user/favorites")
            .then((res) => res.data);
    }

    static addFavorite(id_item: number) {
        return apiClient
            .post<UserFavorite>("/user/favorites", { id_item })
            .then((res) => res.data);
    }

    static removeFavorite(id_item: number) {
        return apiClient
            .delete(`/user/favorites/`, { data: { id_item } })
            .then(() => {});
    }

    static getUserBidItems(params: PaginatedProductParams) {
        return apiClient
            .get<PaginatedResults<FullProductItem>>(`/user/bids`, {
                params,
            })
            .then((res) => res.data);
    }
    static getUserFavoriteItems(params: PaginatedProductParams) {
        return apiClient
            .get<PaginatedResults<FullProductItem>>(`/user/favorites/items`, {
                params,
            })
            .then((res) => res.data);
    }
}
