import { ModalProps } from "flowbite-react";
import { useCallback, useState } from "react";

export type UseModalCreateProps = ModalProps;

export function useModal(props: UseModalCreateProps) {
    const [show, setShow] = useState(props.show || false);

    const onClose = useCallback(() => {
        console.log("useModal->onClose");
        setShow(false);

        if (typeof props.onClose === "function") {
            return props.onClose();
        }
    }, [props.onClose]);

    return {
        ...props,
        show,
        setShow,
        onClose,
    };
}

export type UseModalComponentProps = ReturnType<typeof useModal>;
