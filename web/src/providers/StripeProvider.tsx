import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ReactNode, useMemo, useState } from "react";
import { contextFactory } from "../utils/context";
import StripeService from "../services/StripeService";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

export type StripeContext = {
    clientSecret: string;
    hasClientSecret: boolean;
    isLoadingSetupIntent: boolean;
    setClientSecret: (cs: string) => void;
    loadSetupIntent: () => Promise<void>;
};
export const [StripeContext, useStripeContext] =
    contextFactory<StripeContext>();

export default function StripeProvider({ children }: { children: ReactNode }) {
    const [clientSecret, setClientSecret] = useState("");
    const [isLoadingSetupIntent, setIsloadingSetupIntent] = useState(true);
    const hasClientSecret = useMemo(() => !!clientSecret, [clientSecret]);

    const loadSetupIntent = async () => {
        setIsloadingSetupIntent(true);
        const setupIntent = await StripeService.createSetupIntent();

        setClientSecret(setupIntent.client_secret);
        setIsloadingSetupIntent(false);
    };

    const options = useMemo(() => {
        console.log("computing client setcret, from", clientSecret);
        if (clientSecret) {
            return {
                clientSecret,
            };
        }
        return {};
    }, [clientSecret]);
    return (
        <StripeContext.Provider
            value={{
                clientSecret,
                hasClientSecret,
                isLoadingSetupIntent,
                setClientSecret,
                loadSetupIntent,
            }}
        >
            <Elements
                stripe={stripePromise}
                options={options}
                key={clientSecret}
            >
                {children}
            </Elements>
        </StripeContext.Provider>
    );
}
