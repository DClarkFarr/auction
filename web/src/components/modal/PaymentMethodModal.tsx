import { Modal } from "flowbite-react";
import React from "react";
import PaymentMethodWizard from "../stripe/PaymentMethodWizard";
import { useCardModal, useLoginModal } from "../../stores/useModalsStore";

type PaymentMethodModalProps = { onClose?: () => void };

export default function PaymentMethodModal(props: PaymentMethodModalProps) {
    const loginModal = useLoginModal();
    const cardModal = useCardModal();

    const onSaveCard = React.useCallback(async () => {
        if (typeof props.onClose === "function") {
            props.onClose();
        } else {
            cardModal.close();
        }
    }, []);

    const onClickLogin = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        cardModal.close();
        loginModal.open(
            {},
            {
                scope: "login",
                callback: () => {
                    console.log("login scope invoked -> open card");
                    cardModal.open();
                },
            }
        );
    };

    return (
        <Modal {...props}>
            <Modal.Body className="p-0 rounded-b-lg">
                <PaymentMethodWizard
                    onClickLogin={onClickLogin}
                    onSaveCard={onSaveCard}
                />
            </Modal.Body>
        </Modal>
    );
}
