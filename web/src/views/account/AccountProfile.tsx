import { Button, Label, TextInput } from "flowbite-react";
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
import useForm from "../../hooks/useForm";
import QuickInput from "../../components/controls/QuickInput";

export type UserProfileForm = {
    phone: string;
    subscribedToNewsletter: boolean;
};

const validate = {
    phone: (value: string): [boolean, string] => {
        if (!value || value.replace(/\D/g, "").length !== 10) {
            return [false, "Phone number must be 10 digits"];
        }

        return [true, ""];
    },
};

export default function AccountProfile() {
    const { user, paymentMethod, updateUser } = useUserStore();
    const { toast } = useToastContext();

    const [paymentView, setPaymentView] = React.useState<"form" | "card">(
        "card"
    );

    const initialState = React.useMemo(() => {
        return {
            phone: user?.phone || "",
            subscribedToNewsletter: user?.subscribedToNewsletter || false,
        };
    }, [user]);

    const {
        fields: { phone, subscribedToNewsletter },
        isSubmitting,
        handleSubmit,
        setField,
        isValid,
        attrs,
    } = useForm<UserProfileForm>({
        initialState,
        validate,
        resetOnSubmit: false,
        onSubmit: async (data) => {
            try {
                const updated = await UserService.saveProfile(data);
                updateUser(updated);

                toast({
                    text: "Profile updated successfully",
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
            }
        },
    });

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

                    <form action="" onSubmit={handleSubmit}>
                        <div className="mb-8">
                            <QuickInput
                                name="phone"
                                lable="Phone #"
                                field={phone}
                                {...attrs}
                            />
                        </div>
                        <div className="mb-4">
                            <div className="mb-2">
                                <Label className="text-xl">
                                    Email notification settings
                                </Label>
                            </div>

                            <Label>New auctions</Label>
                            <div>
                                <label className="inline-flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={subscribedToNewsletter.value}
                                        onChange={(e) => {
                                            const target =
                                                e.target as HTMLInputElement;

                                            console.log(
                                                "setting",
                                                target.checked
                                            );
                                            setField("subscribedToNewsletter", {
                                                value: target.checked,
                                                dirty: true,
                                            });
                                        }}
                                    />
                                    <span>
                                        {subscribedToNewsletter.value
                                            ? "Subscribed"
                                            : "Not subscribed"}
                                    </span>
                                </label>
                            </div>
                        </div>
                        <Button
                            type="submit"
                            isProcessing={isSubmitting}
                            disabled={isSubmitting || !isValid}
                        >
                            Save Profile
                        </Button>
                    </form>
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
                                                className="text-cyan-600 hover:text-cyan-700 hover:underline"
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
