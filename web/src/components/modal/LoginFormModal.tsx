import { Modal } from "flowbite-react";
import LoginForm, { LoginFormProps } from "../user/LoginForm";
import useUserStore from "../../stores/useUserStore";
import React from "react";
import { UseModalCreateProps } from "../../hooks/useModal";
import { Link } from "react-router-dom";

type LoginFormModalProps = UseModalCreateProps;

export default function LoginFormModal(props: LoginFormModalProps) {
    const { login } = useUserStore();
    const onSubmit = React.useCallback(
        async (data: Parameters<LoginFormProps["onSubmit"]>[0]) => {
            await login(data.email, data.password);

            if (typeof props.onClose === "function") {
                props.onClose();
            }
        },
        []
    );

    const onClickSignup = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        console.log("show signup!");
    };

    return (
        <Modal {...props}>
            <Modal.Header>Login to Bid!</Modal.Header>
            <Modal.Body className="p-0 rounded-b-lg">
                <LoginForm onSubmit={onSubmit} />
                <div className="text-center py-4 mb-2">
                    <div className="mb-4 font-semibold">OR</div>
                    <Link
                        className="text-purple-700 hover:underline"
                        to="#"
                        onClick={onClickSignup}
                    >
                        Create Account
                    </Link>
                </div>
            </Modal.Body>
        </Modal>
    );
}
