import apiClient from "./apiClient";

export default class StripeService {
    static getCustomer() {
        return apiClient
            .get<{ external_id: string }>("/stripe/customer")
            .then((res) => res.data);
    }
    static createSetupIntent() {
        return apiClient
            .post<{ client_secret: string; customer: string }>(
                "/stripe/setup-intent"
            )
            .then((res) => res.data);
    }
}
