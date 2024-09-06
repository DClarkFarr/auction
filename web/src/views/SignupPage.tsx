import { useCallback } from "react";
import useUserStore from "../stores/useUserStore";
import { Link } from "react-router-dom";
import SignupForm from "../components/user/SignupForm";
import { RegisterPayload } from "../types/User";
import useRedirect from "../hooks/useRedirect";

export default function SignupPage() {
    const { register } = useUserStore();
    const { redirect } = useRedirect("/");

    const onSubmit = useCallback(async (data: RegisterPayload) => {
        await register(data);
        redirect();
    }, []);
    return (
        <div>
            <div className="container">
                <div className="py-8 lg:py-[150px]">
                    <div className="flex justify-center">
                        <div className="w-[450px] max-w-full">
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
                    </div>
                </div>
            </div>
        </div>
    );
}
