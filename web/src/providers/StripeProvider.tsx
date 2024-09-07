import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React, { ReactNode, useMemo, useState } from "react";
import { contextFactory } from "../utils/context";
import StripeService from "../services/StripeService";
import useUserStore from "../stores/useUserStore";

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

export type StripeProviderProps = {
    children: ReactNode;
    initWithSetup?: boolean;
};
let isQuerying = false;
export default function StripeProvider({
    children,
    initWithSetup,
}: StripeProviderProps) {
    const [clientSecret, setClientSecret] = useState("");
    const [isLoadingSetupIntent, setIsloadingSetupIntent] = useState(true);
    const hasClientSecret = useMemo(() => !!clientSecret, [clientSecret]);

    const { user } = useUserStore();

    const loadSetupIntent = async () => {
        if (isQuerying) {
            return;
        }
        isQuerying = true;
        setIsloadingSetupIntent(true);
        const setupIntent = await StripeService.createSetupIntent();
        setClientSecret(setupIntent.client_secret);
        setIsloadingSetupIntent(false);
        isQuerying = false;
    };

    React.useEffect(() => {
        if (initWithSetup && user?.id) {
            loadSetupIntent();
        }
    }, []);

    const options = useMemo(() => {
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
                key={clientSecret + user?.id}
            >
                {children}
            </Elements>
        </StripeContext.Provider>
    );
}
