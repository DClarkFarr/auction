import { useCallback } from "react";
import { LoginForm, LoginFormProps } from "../components/user/LoginForm";
import useUserStore from "../stores/useUserStore";
import { Link } from "react-router-dom";

export default function LoginPage() {
    const { login } = useUserStore();
    const onSubmit = useCallback(
        async (data: Parameters<LoginFormProps["onSubmit"]>[0]) => {
            await login(data.email, data.password);
            console.log("REDIRECT!");
        },
        []
    );
    return (
        <div>
            <div className="">
                <LoginForm
                    onSubmit={onSubmit}
                    footer={
                        <div className="mt-4 text-center">
                            <Link
                                className="text-base text-purple-500 hover:underline"
                                to="/sign-up"
                            >
                                Create Account
                            </Link>
                        </div>
                    }
                />
            </div>
        </div>
    );
}
