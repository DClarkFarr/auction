import { useCallback } from "react";
import { LoginForm, LoginFormProps } from "../components/user/LoginForm";
import useUserStore from "../stores/useUserStore";

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
            <LoginForm onSubmit={onSubmit} />
        </div>
    );
}
