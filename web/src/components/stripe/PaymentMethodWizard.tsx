import { Alert, Button } from "flowbite-react";
import React, { useCallback, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import StripeCardForm from "./StripeCardForm";
import CardDetails from "./CardDetails";
import useUserStore from "../../stores/useUserStore";

type WizardView = "login" | "form" | "success" | "card";
function PaymentMethodWizardComponent() {
    const [search, setSearch] = useSearchParams();

    const view = search.get("payment-wizard-view") || "login";

    const setView = (v: WizardView) => {
        setSearch({ "payment-wizard-view": v });
    };

    const { paymentMethod, user } = useUserStore();

    useEffect(() => {
        if (!user && view !== "login") {
            setView("login");
            return;
        }

        if (user && view === "login") {
            setView(paymentMethod ? "card" : "form");
            return;
        }
    }, [user, view, paymentMethod]);

    const onCardSaved = useCallback(() => {
        setView("success");

        setTimeout(() => {
            setView("card");
        }, 4000);
    }, []);

    return (
        <div className="border border-gray-800 p-4 rounded-lg max-w-[450px]">
            {view === "login" && <LoginView />}
            {view === "form" && (
                <>
                    <h3 className="mb-2 text-xl font-semibold">
                        Default Payment Method
                    </h3>
                    <p className="mb-10">
                        You will not be charged now. After you have won your
                        bids, you select winning bids and complete the purchase
                        with the card on file.
                    </p>
                    <StripeCardForm onSuccess={onCardSaved} />
                </>
            )}
            {view === "card" && (
                <>
                    {paymentMethod && (
                        <>
                            <h3 className="mb-2 text-xl font-semibold">
                                Default Payment Method
                            </h3>
                            <p className="mb-10">
                                You will not be charged now. After you have won
                                your bids, you select winning bids and complete
                                the purchase with the card on file.
                            </p>
                            <CardDetails
                                paymentMethod={paymentMethod}
                                actions={
                                    <>
                                        <Link
                                            to=""
                                            className="text-purple-600 hover:text-purple-700 hover:underline"
                                            onClick={(e) => (
                                                setView("form"),
                                                e.preventDefault()
                                            )}
                                        >
                                            Edit
                                        </Link>
                                    </>
                                }
                            />
                        </>
                    )}
                    {!paymentMethod && (
                        <div>
                            <Alert color="failure">
                                Error loading payment method
                            </Alert>
                            <Link
                                to=""
                                onClick={(e) => (
                                    setView("form"), e.preventDefault()
                                )}
                                className="text-purple-600 hover:text-purple-700 hover:underline"
                            >
                                Add new payment method
                            </Link>
                        </div>
                    )}
                </>
            )}
            {view === "success" && <SuccessView />}
        </div>
    );
}

const PaymentMethodWizard = React.memo(PaymentMethodWizardComponent);

export default PaymentMethodWizard;

function SuccessView() {
    return (
        <div className="bg-green-700 text-white text-center p-6">
            <h1 className="text-xl font-semibold">Congrats!</h1>
            <p>Your payment method was saved. You may now bid on any item.</p>
        </div>
    );
}
function LoginView() {
    return (
        <div className="p-8">
            <h3 className="mb-2 text-xl font-semibold">
                Default Payment Method
            </h3>
            <p className="mb-6">
                You must be logged in to save a payment method.
            </p>
            <div className="text-center">
                <Button as={Link} to="/login">
                    Login
                </Button>
            </div>
        </div>
    );
}
