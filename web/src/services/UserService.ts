import { ResetPasswordState } from "../components/user/ResetPasswordForm";
import { PaymentMethod } from "../stores/useUserStore";
import { Bid } from "../types/Bid";
import { PaginatedResults } from "../types/Paginate";
import { FullProductItem, ProductItemStatus } from "../types/Product";
import { FullPurchase, Purchase } from "../types/Purchase";
import { RegisterPayload, User, UserFavorite } from "../types/User";
import { UserProfileForm } from "../views/account/AccountProfile";
import apiClient from "./apiClient";
import { PaginatedProductParams } from "./SiteService";

export type CheckoutItemsParams = {
    itemIds: number[];
};
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

    static getUserBids() {
        return apiClient.get<Bid[]>("/user/bids").then((res) => res.data);
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

    static getUserBidItems(
        params: PaginatedProductParams & {
            winning: boolean;
            days?: number;
            status?: ProductItemStatus[];
        }
    ) {
        return apiClient
            .get<PaginatedResults<FullProductItem>>(`/user/bids/items`, {
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

    static async checkoutItems(data: CheckoutItemsParams) {
        return apiClient
            .post<{ purchase: Purchase; items: FullProductItem[] }>(
                `/user/checkout/items`,
                data
            )
            .then((res) => res.data);
    }

    static async purchases() {
        return apiClient
            .get<FullPurchase[]>(`/user/purchases`)
            .then((res) => res.data);
    }

    static async purchase(idPurchase: number) {
        return apiClient
            .get<FullPurchase>(`/user/purchases/${idPurchase}`)
            .then((res) => res.data);
    }

    static async saveProfile(data: UserProfileForm) {
        return apiClient
            .put<{ user: User }>("/user/profile", data)
            .then((res) => res.data.user);
    }

    static async sendForgotPassword(email: string) {
        return apiClient
            .post(`/user/password/forgot`, { email })
            .then((res) => res.data);
    }

    static async resetForgotPassword(data: {
        code: string;
        password: string;
        passwordConfirm: string;
        email: string;
    }) {
        return apiClient
            .post(`/user/password/reset`, data)
            .then((res) => res.data);
    }
}
