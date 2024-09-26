import React from "react";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { homeRoutes } from "../../router";
import { Link } from "react-router-dom";
import UserService from "../../services/UserService";
import useToastContext from "../../providers/useToastContext";
import ForgotPasswordResetForm from "./ForgotPasswordResetForm";

export type ForgotPasswordWizardProps = {
    onSuccess: () => void;
};
export type ForgotView = "forgot" | "reset";

export default function ForgotPasswordWizard({
    onSuccess,
}: ForgotPasswordWizardProps) {
    const [view, setView] = React.useState<ForgotView>("forgot");
    const [email, setEmail] = React.useState("");

    const { toast } = useToastContext();

    const onRequestCode = React.useCallback(
        async ({ email }: { email: string }) => {
            await UserService.sendForgotPassword(email);
            toast({
                type: "success",
                text: "A reset code was sent to your email",
            });
            console.log("setting email", email);
            setEmail(email);
            setView("reset");
        },
        []
    );

    const onResetPassword = React.useCallback(
        async (data: {
            code: string;
            password: string;
            passwordConfirm: string;
        }) => {
            await UserService.resetForgotPassword({ ...data, email });
            toast({
                type: "success",
                text: "Password reset successfully. You may now log in.",
            });
            onSuccess();
        },
        [email]
    );

    if (view === "forgot") {
        return (
            <ForgotPasswordForm
                onSubmit={onRequestCode}
                footer={
                    <div className="mt-4 text-center">
                        <Link
                            className="text-base text-cyan-500 hover:underline"
                            to={homeRoutes.login.to}
                        >
                            Back to login
                        </Link>
                    </div>
                }
            />
        );
    }

    return (
        <ForgotPasswordResetForm
            onSubmit={onResetPassword}
            footer={
                <div className="mt-4 text-center">
                    <a
                        className="text-base text-cyan-500 hover:underline"
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            setView("forgot");
                        }}
                    >
                        Back
                    </a>
                </div>
            }
        />
    );
}
