import { useCallback } from "react";
import useUserStore from "../stores/useUserStore";
import { Link } from "react-router-dom";
import SignupForm, { SignupFormProps } from "../components/user/SignupForm";

export default function SignupPage() {
    const { register } = useUserStore();
    const onSubmit = useCallback(
        async (data: Parameters<SignupFormProps["onSubmit"]>[0]) => {
            await register(data.email, data.password, data.token);
            console.log("REDIRECT!");
        },
        []
    );
    return (
        <div>
            <SignupForm
                onSubmit={onSubmit}
                footer={
                    <div className="mt-4 text-center">
                        <Link
                            className="text-base text-purple-500 hover:underline"
                            to="/login"
                        >
                            Back to login
                        </Link>
                    </div>
                }
            />
        </div>
    );
}
