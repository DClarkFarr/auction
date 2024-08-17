import { useCallback } from "react";
import { LoginFormProps } from "../components/user/LoginForm";
import useUserStore from "../stores/useUserStore";
import { Link } from "react-router-dom";

export default function SignupPage() {
    const { register } = useUserStore();
    const onSubmit = useCallback(
        async (data: Parameters<LoginFormProps["onSubmit"]>[0]) => {
            await register(data.email, data.password);
            console.log("REDIRECT!");
        },
        []
    );
    return (
        <div>
            <div className="">signy winny</div>
        </div>
    );
}
