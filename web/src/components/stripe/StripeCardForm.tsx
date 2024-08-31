import {
    PaymentElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";
import { StripePaymentElementChangeEvent } from "@stripe/stripe-js";
import { Alert, Button, Label, Spinner } from "flowbite-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useStripeContext } from "../../providers/StripeProvider";
import StripeService from "../../services/StripeService";
import useUserStore from "../../stores/useUserStore";

export default function StripeCardForm({
    onSuccess,
}: {
    onSuccess?: () => void;
}) {
    const [isReady, setIsReady] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { setPaymentMethod } = useUserStore();

    const stripe = useStripe();
    const elements = useElements();

    const { hasClientSecret, loadSetupIntent, isLoadingSetupIntent } =
        useStripeContext();

    const onReady = (/*e: StripePaymentElement*/) => {
        setIsReady(true);
    };

    const onChange = (e: StripePaymentElementChangeEvent) => {
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

        setIsSubmitting(true);
        try {
            const { setupIntent, error } = await stripe.confirmSetup({
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

            if (error) {
                console.error("Error saving intent", error);
                setErrorMessage(
                    error.message || "Payment information could not be saved"
                );
                return;
            }

            if (setupIntent && setupIntent.payment_method) {
                const paymentMethod =
                    typeof setupIntent.payment_method === "object"
                        ? setupIntent.payment_method?.id
                        : setupIntent.payment_method;

                const pm = await StripeService.savePaymentMethod(paymentMethod);

                setPaymentMethod(pm || null);
            }
            if (typeof onSuccess === "function") {
                onSuccess();
            }
        } catch (err) {
            console.warn("got error", err);
            if (err instanceof Error) {
                setErrorMessage(err.message);
            }
        } finally {
            setIsSubmitting(false);
            loadSetupIntent();
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
                        {errorMessage && (
                            <Alert color="failure" className="mb-4">
                                <div className="font-semibold">
                                    Error saving payment method
                                </div>
                                <div>{errorMessage}</div>
                            </Alert>
                        )}
                        <div>
                            <Button
                                size="sm"
                                className="btn-block w-full text-center"
                                type="submit"
                                disabled={!isReady || isSubmitting}
                                isProcessing={isSubmitting}
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
