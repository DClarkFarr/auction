import { Modal } from "flowbite-react";
import LoginForm, { LoginFormProps } from "../user/LoginForm";
import useUserStore from "../../stores/useUserStore";
import useRedirect from "../../hooks/useRedirect";
import React from "react";
import { UseModalCreateProps } from "../../hooks/useModal";

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

    return (
        <Modal {...props}>
            <Modal.Header>Login to Bid!</Modal.Header>
            <Modal.Body className="p-0 rounded-b-lg">
                <LoginForm onSubmit={onSubmit} />
            </Modal.Body>
        </Modal>
    );
}
