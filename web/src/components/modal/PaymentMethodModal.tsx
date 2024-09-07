import { Modal } from "flowbite-react";
import React from "react";
import PaymentMethodWizard from "../stripe/PaymentMethodWizard";
import { useGlobalModalContext } from "../../providers/useGlobalModals";

type PaymentMethodModalProps = { onClose?: () => void };

export default function PaymentMethodModal(props: PaymentMethodModalProps) {
    const { signup, card } = useGlobalModalContext();

    const onSaveCard = React.useCallback(async () => {
        console.log("you saved your card");
        if (typeof props.onClose === "function") {
            props.onClose();
        }
    }, []);

    const onClickLogin = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        console.log("preventing and calling");
        // login.open(() => {
        //     console.log("card open queued");
        //     card.open();
        // });
        signup.open(() => {
            console.log("card open queued");
            card.open();
        });
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
