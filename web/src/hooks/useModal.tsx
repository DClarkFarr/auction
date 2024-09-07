import { ModalPositions, ModalProps, ModalSizes } from "flowbite-react";
import React from "react";

export type UseModalCreateProps = ModalProps;

export type UseModalConfig = {
    onClose?: () => void;
    position?: keyof ModalPositions;
    popup?: boolean;
    root?: HTMLElement;
    show?: boolean;
    size?: keyof ModalSizes;
    dismissible?: boolean;
    theme?: ModalProps["theme"];
    initialFocus?: ModalProps["initialFocus"];
};

export function useModal({
    onClose: defaultOnClose,
    ...props
}: UseModalCreateProps) {
    const [modalState, setModalState] = React.useState<
        Omit<UseModalConfig, "onClose">
    >({
        show: false,
        position: "center",
        size: "lg",
        dismissible: true,
        ...props,
    });

    const callbacks = React.useRef<Pick<UseModalConfig, "onClose">>({
        onClose: defaultOnClose,
    });

    const updateModalState = React.useCallback(
        ({ onClose, ...toSet }: Partial<UseModalConfig>) => {
            callbacks.current.onClose = onClose;
            setModalState((p) => ({ ...p, ...toSet }));
        },
        []
    );

    const onClose = React.useCallback(() => {
        updateModalState({ show: false });

        if (typeof callbacks.current.onClose === "function") {
            return callbacks.current.onClose();
        }
    }, []);

    const open = React.useCallback(
        (props: Partial<UseModalConfig> = {}) => {
            updateModalState({ ...props, show: true });
        },
        [modalState]
    );

    const state = React.useMemo(() => {
        return { ...modalState, show: modalState.show || false, onClose };
    }, [modalState]);

    return {
        open,
        close,
        state,
        setState: setModalState,
    };
}

export type UseModalComponentProps = ReturnType<typeof useModal>;
