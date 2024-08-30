import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ReactNode } from "react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

export default function StripeProvider({ children }: { children: ReactNode }) {
    const options = {};
    return (
        <Elements stripe={stripePromise} options={options}>
            {children}
        </Elements>
    );
}
