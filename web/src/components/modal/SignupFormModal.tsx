import { Modal } from "flowbite-react";
import SignupForm, { SignupFormProps } from "../user/SignupForm";
import useUserStore from "../../stores/useUserStore";
import React from "react";
import { UseModalCreateProps } from "../../hooks/useModal";
import { Link } from "react-router-dom";
import { useLoginModal, useSignupModal } from "../../stores/useModalsStore";

type SignupFormModalProps = UseModalCreateProps;

export default function SignupFormModal(props: SignupFormModalProps) {
    const { register } = useUserStore();

    const loginModal = useLoginModal();
    const signupModal = useSignupModal();

    const onSubmit = React.useCallback(
        async (data: Parameters<SignupFormProps["onSubmit"]>[0]) => {
            await register(data);

            signupModal.invokeIntents();

            if (typeof props.onClose === "function") {
                props.onClose();
            } else {
                signupModal.close();
            }
        },
        []
    );

    const onClickLogin = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        signupModal.close();
        loginModal.open();
        loginModal.transferIntents("signup");
    };

    return (
        <Modal {...props}>
            <Modal.Header>Sign Up</Modal.Header>
            <Modal.Body className="p-0 rounded-b-lg">
                <SignupForm onSubmit={onSubmit} />
                <div className="text-center py-4 mb-2">
                    <div className="mb-4 font-semibold">OR</div>
                    <Link
                        className="text-purple-700 hover:underline"
                        to="#"
                        onClick={onClickLogin}
                    >
                        Back to Login
                    </Link>
                </div>
            </Modal.Body>
        </Modal>
    );
}
