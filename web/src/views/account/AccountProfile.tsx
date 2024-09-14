import { Label, TextInput } from "flowbite-react";
import Panel from "../../components/controls/Panel";
import useUserStore from "../../stores/useUserStore";
import ResetPasswordForm, {
    ResetPasswordState,
} from "../../components/user/ResetPasswordForm";
import UserService from "../../services/UserService";
import useToastContext from "../../providers/useToastContext";
import { AxiosError } from "axios";
import CardDetails from "../../components/stripe/CardDetails";
import { Link } from "react-router-dom";
import React from "react";
import StripeProvider from "../../providers/StripeProvider";
import StripeCardForm from "../../components/stripe/StripeCardForm";

export default function AccountProfile() {
    const { user, paymentMethod } = useUserStore();
    const { toast } = useToastContext();

    const [paymentView, setPaymentView] = React.useState<"form" | "card">(
        "card"
    );

    if (!user) {
        return null;
    }

    const onSubmitPassword = async (data: ResetPasswordState) => {
        try {
            await UserService.changeUserPassword(user.id, data);
            toast({
                text: "Password updated successfully",
                type: "success",
            });
        } catch (err) {
            if (err instanceof AxiosError) {
                toast({
                    text: err.response?.data?.message || err.message,
                    type: "failure",
                });
            } else if (err instanceof Error) {
                toast({
                    text: err.message,
                    type: "failure",
                });
            }

            throw err;
        }
    };

    const onCardSaved = () => {
        toast({
            text: "Payment method saved",
            type: "success",
        });
        setPaymentView("card");
    };

    return (
        <div className="account-profile">
            <div className="container">
                <h1 className="text-2xl font-bold mb-10">Profile Setting</h1>
                <Panel title="Profile">
                    <div className="mb-4">
                        <Label>Name</Label>
                        <TextInput value={user.name} disabled />
                    </div>
                    <div className="mb-4">
                        <Label>Email</Label>
                        <TextInput value={user.email} disabled />
                    </div>
                </Panel>

                <div className="h-10"></div>

                <Panel title="Reset password">
                    <ResetPasswordForm onSubmit={onSubmitPassword} />
                </Panel>

                <div className="h-10"></div>

                {paymentMethod && (
                    <Panel title="Payment Method">
                        {paymentView === "card" && (
                            <div className="mb-4">
                                <h3 className="font-semibold text-gray-800 mb-1">
                                    Saved Card On File
                                </h3>
                                <CardDetails
                                    paymentMethod={paymentMethod}
                                    actions={
                                        <>
                                            <Link
                                                to=""
                                                className="text-purple-600 hover:text-purple-700 hover:underline"
                                                onClick={(e) => (
                                                    setPaymentView("form"),
                                                    e.preventDefault()
                                                )}
                                            >
                                                Edit
                                            </Link>
                                        </>
                                    }
                                />
                            </div>
                        )}
                        {paymentView === "form" && (
                            <>
                                <h3 className="mb-2 text-xl font-semibold">
                                    Default Payment Method
                                </h3>
                                <p className="mb-10">
                                    You will not be charged now. After you have
                                    won your bids, you select winning bids and
                                    complete the purchase with the card on file.
                                </p>
                                <StripeProvider initWithSetup>
                                    <StripeCardForm onSuccess={onCardSaved} />
                                </StripeProvider>
                            </>
                        )}
                    </Panel>
                )}
            </div>
        </div>
    );
}
