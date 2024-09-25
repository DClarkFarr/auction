import { useCallback } from "react";
import LoginForm, { LoginFormProps } from "../components/user/LoginForm";
import useUserStore from "../stores/useUserStore";
import { Link } from "react-router-dom";
import useRedirect from "../hooks/useRedirect";

export default function LoginPage() {
    const { login } = useUserStore();
    const { redirect } = useRedirect("/");
    const onSubmit = useCallback(
        async (data: Parameters<LoginFormProps["onSubmit"]>[0]) => {
            await login(data.email, data.password);
            redirect();
        },
        []
    );

    return (
        <div>
            <div className="container">
                <div className="py-8 lg:py-[150px]">
                    <div className="flex justify-center">
                        <div className="w-[450px] max-w-full">
                            <LoginForm
                                onSubmit={onSubmit}
                                footer={
                                    <div className="mt-4 text-center">
                                        <Link
                                            className="text-base text-cyan-500 hover:underline"
                                            to="/sign-up"
                                        >
                                            Create Account
                                        </Link>
                                    </div>
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
