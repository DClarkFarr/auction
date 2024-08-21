import { Modal } from "flowbite-react";
import { FormModalProps } from "../../types/Modal";

export default function FormModal<D>({
    form: Form,
    heading,
    ...props
}: FormModalProps<D>) {
    return (
        <Modal
            show={props.openModal}
            size={props.size}
            dismissible={props.dismissable}
            onClose={props.onClose}
        >
            <Modal.Header>
                {typeof heading === "string" ? (
                    <span className="text-lg font-semibold">{heading}</span>
                ) : (
                    heading
                )}
            </Modal.Header>
            <Modal.Body className="p-0">
                <Form
                    onSubmit={props.onAccept}
                    onCancel={props.onCancel}
                    initialState={props.initialState}
                />
            </Modal.Body>
        </Modal>
    );
}
