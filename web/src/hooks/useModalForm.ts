import { useCallback, useState } from "react";
import { FormModalProps } from "../types/Modal";

export type UseFormModalProps = {
    onAccept: FormModalProps["onAccept"];
} & Partial<Omit<FormModalProps, "setOpenModal" | "onAccept" | "form">>;

export function useFormModal(
    props: UseFormModalProps
): Omit<FormModalProps, "form"> {
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
        onAccept: props.onAccept,
        setOpenModal,
        onCancel,
        onClose,
    };
}
