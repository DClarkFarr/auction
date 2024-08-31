import {
    PaymentElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";
import {
    StripeElementStyle,
    StripePaymentElement,
    StripePaymentElementChangeEvent,
} from "@stripe/stripe-js";
import { Alert, Button, Label, Spinner } from "flowbite-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import useStripeSetupIntent from "../../hooks/useStripeSetupIntent";
import { useStripeContext } from "../../providers/StripeProvider";

/**
 * Should be inside <StripeProvider>
 */

const style: StripeElementStyle = {
    base: {
        iconColor: "#555",
        color: "#555",
        fontWeight: "500",
        fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
        fontSize: "18px",
        fontSmoothing: "antialiased",
        padding: "12px",
        ":-webkit-autofill": {
            color: "#555",
        },
        "::placeholder": {
            color: "#797979",
        },
    },
    invalid: {
        iconColor: "#991b1b",
        color: "#991b1b",
    },
};
export default function StripeCardForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [isValid, setIsValid] = useState(false);

    const stripe = useStripe();
    const elements = useElements();

    const { hasClientSecret, loadSetupIntent, isLoadingSetupIntent } =
        useStripeContext();

    const onReady = (e: StripePaymentElement) => {
        console.log("ready event was", e);

        setIsReady(true);
    };

    const onChange = (e: StripePaymentElementChangeEvent) => {
        console.log("change event was", e);

        setIsValid(e.complete);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isValid) {
            const cardRef = elements?.getElement("card");
            if (cardRef) {
                cardRef.focus();
            }
            return;
        }

        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        const { setupIntent } = await stripe.confirmSetup({
            //`Elements` instance that was used to create the Payment Element
            elements,
            confirmParams: {
                return_url:
                    window.location.origin +
                    window.location.pathname +
                    "?status=complete",
            },
            redirect: "if_required",
        });

        if (setupIntent) {
            const paymentMethod = setupIntent.payment_method;
        }
    };

    const isLoading = useMemo(() => {
        return !hasClientSecret || isLoadingSetupIntent;
    }, [hasClientSecret, isLoadingSetupIntent]);

    useEffect(() => {
        if (!hasClientSecret) {
            loadSetupIntent();
        }
    }, []);

    return (
        <div className="border border-gray-800 p-4 rounded-lg max-w-[450px]">
            <form onSubmit={handleSubmit}>
                <h3 className="mb-2 text-xl font-semibold">
                    Default Payment Method
                </h3>
                <p className="mb-10">
                    You will not be charged now. After you have won your bids,
                    you select winning bids and complete the purchase with the
                    card on file.
                </p>
                <Label>Credit Card</Label>
                {isLoading && (
                    <div className="p-10 flex justify-center items-center bg-gray-100">
                        <Spinner />
                    </div>
                )}
                {!isLoading && !hasClientSecret && (
                    <>
                        <Alert color="failure">
                            Error loading payment form. Please inform support.
                        </Alert>
                    </>
                )}
                {!isLoading && hasClientSecret && (
                    <>
                        <div className="bg-gray-100 p-1 rounded-lg border-1 border-gray-200 mb-4">
                            <PaymentElement
                                onReady={onReady}
                                onChange={onChange}
                                options={{
                                    layout: {
                                        type: "accordion",
                                        defaultCollapsed: false,
                                    },
                                }}
                            />
                        </div>
                        <div>
                            <Button
                                size="sm"
                                className="btn-block w-full text-center"
                                type="submit"
                                disabled={!isReady}
                                isProcessing={!isReady}
                            >
                                Save Default Card
                            </Button>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
}
