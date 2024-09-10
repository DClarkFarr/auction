import { useQuery } from "@tanstack/react-query";
import UserService from "../services/UserService";

export default function usePurchasesQuery() {
    const { data, isLoading, isSuccess, error } = useQuery({
        queryKey: ["purchases"],
        queryFn: () => {
            return UserService.purchases();
        },
    });

    return { purchases: data || [], isLoading, isSuccess, error };
}
