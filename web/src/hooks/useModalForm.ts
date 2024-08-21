import { useCallback, useState } from "react";
import { FormModalProps } from "../types/Modal";

export type UseFormModalProps<D> = {
    onAccept: FormModalProps<D>["onAccept"];
} & Partial<Omit<FormModalProps<D>, "setOpenModal" | "onAccept" | "form">>;

export function useFormModal<D>(
    props: UseFormModalProps<D>
): Omit<FormModalProps<D>, "form"> {
    const [openModal, setOpenModal] = useState(props.openModal || false);

    const onCancel = useCallback(() => {
        if (typeof props.onCancel === "function") {
            return props.onCancel();
        }

        setOpenModal(false);
    }, [props.onCancel]);

    const onClose = useCallback(() => {
        if (typeof props.onClose === "function") {
            return props.onClose();
        }

        setOpenModal(false);
    }, [props.onClose]);

    return {
        openModal,
        size: props.size,
        dismissable: props.dismissable,
        initialState: props.initialState,
        heading: props.heading,
        onAccept: props.onAccept,
        setOpenModal,
        onCancel,
        onClose,
    };
}
