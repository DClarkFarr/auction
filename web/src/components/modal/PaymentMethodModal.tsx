import { Modal } from "flowbite-react";
import React from "react";
import PaymentMethodWizard from "../stripe/PaymentMethodWizard";

type PaymentMethodModalProps = { onClose?: () => void };

export default function PaymentMethodModal(props: PaymentMethodModalProps) {
    const onSaveCard = React.useCallback(async () => {
        console.log("you saved your card");
        if (typeof props.onClose === "function") {
            props.onClose();
        }
    }, []);

    return (
        <Modal {...props}>
            <Modal.Body className="p-0 rounded-b-lg">
                <PaymentMethodWizard onSaveCard={onSaveCard} />
            </Modal.Body>
        </Modal>
    );
}
