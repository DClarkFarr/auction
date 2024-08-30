import { useQuery } from "@tanstack/react-query";
import useUserStore from "../stores/useUserStore";
import StripeService from "../services/StripeService";

export default function useStripeCustomer() {
    const { user } = useUserStore();

    const { data: customer } = useQuery({
        queryKey: ["stripeCustomer", user?.id],
        queryFn: () => StripeService.getCustomer(),
        enabled: !!user?.id,
    });

    return customer;
}
