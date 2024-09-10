import { useQuery } from "@tanstack/react-query";
import UserService from "../services/UserService";

export default function usePurchaseQuery(idPurchase: number) {
    const { data, isLoading, isSuccess, error } = useQuery({
        queryKey: ["purchase", idPurchase],
        queryFn: () => {
            return UserService.purchase(idPurchase);
        },
    });

    return { purchase: data || null, isLoading, isSuccess, error };
}
