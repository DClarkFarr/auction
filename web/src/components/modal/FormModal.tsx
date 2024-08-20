import { Modal } from "flowbite-react";
import { FormModalProps } from "../../types/Modal";

export default function FormModal<Accept extends object>({
    form: Form,
    ...props
}: FormModalProps<Accept>) {
    return (
        <Modal
            show={props.openModal}
            size={props.size}
            dismissible={props.dismissable}
            onClose={props.onClose}
        >
            <Modal.Header />
            <Modal.Body>
                <Form
                    onSubmit={props.onAccept}
                    onCancel={props.onCancel}
                    initialState={props.initialState}
                />
            </Modal.Body>
        </Modal>
    );
}
