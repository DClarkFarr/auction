import { useQuery, useQueryClient } from "@tanstack/react-query";
import useUserStore from "../stores/useUserStore";
import StripeService from "../services/StripeService";

export default function useStripeSetupIntent(hasSetupIntent?: boolean) {
    const { user } = useUserStore();

    const queryClient = useQueryClient();

    const {
        data: setupIntent,
        isLoading,
        isSuccess,
    } = useQuery({
        queryKey: ["stripeSetupIntent", user?.id],
        queryFn: () => StripeService.createSetupIntent(),
        enabled: !!user?.id || hasSetupIntent,
        retry: false,
    });

    const retry = () => {
        queryClient.invalidateQueries({
            queryKey: ["stripeSetupIntent", user?.id],
        });
    };

    return {
        setupIntent,
        isLoading,
        isSuccess,
        retry,
    };
}
