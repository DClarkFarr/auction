import { createPortal } from "react-dom";
import { GlobalModalContext } from "./useGlobalModals";
import React from "react";
import { useModal } from "../hooks/useModal";
import LoginFormModal from "../components/modal/LoginFormModal";

export default function GlobalModalProvider({
    children,
    teleportRef,
}: {
    children: React.ReactNode;
    teleportRef: React.RefObject<HTMLDivElement>;
}) {
    const { setShow: setLoginShow, ...loginModalProps } = useModal({
        show: false,
    });

    const login = React.useMemo(() => {
        return {
            show: loginModalProps.show,
            open: () => setLoginShow(true),
            close: () => setLoginShow(false),
        };
    }, [loginModalProps, setLoginShow]);

    return (
        <GlobalModalContext.Provider
            value={{
                login,
            }}
        >
            {children}
            {teleportRef.current &&
                createPortal(
                    <>
                        <LoginFormModal {...loginModalProps} />
                    </>,
                    teleportRef.current
                )}
        </GlobalModalContext.Provider>
    );
}
