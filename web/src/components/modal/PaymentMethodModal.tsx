import { Modal } from "flowbite-react";
import React from "react";
import PaymentMethodWizard from "../stripe/PaymentMethodWizard";
import { useCardModal, useLoginModal } from "../../stores/useModalsStore";

type PaymentMethodModalProps = { onClose?: () => void };

export default function PaymentMethodModal(props: PaymentMethodModalProps) {
    const loginModal = useLoginModal();
    const cardModal = useCardModal();

    const onSaveCard = React.useCallback(async () => {
        cardModal.invokeIntents();

        if (typeof props.onClose === "function") {
            props.onClose();
        } else {
            cardModal.close();
        }
    }, []);

    const onClickLogin = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        cardModal.close();
        loginModal.transferIntents("card");
        loginModal.open();
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
