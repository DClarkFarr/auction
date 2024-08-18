import { useCallback } from "react";
import useUserStore from "../stores/useUserStore";
import { Link } from "react-router-dom";
import SignupForm from "../components/user/SignupForm";
import { RegisterPayload } from "../types/User";

export default function SignupPage() {
    const { register } = useUserStore();
    const onSubmit = useCallback(async (data: RegisterPayload) => {
        await register(data);
        console.log("REDIRECT!");
    }, []);
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
