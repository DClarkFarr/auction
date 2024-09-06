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

    const loginCallbacks = React.useRef<CallableFunction[]>([]);

    const login = React.useMemo(() => {
        return {
            show: loginModalProps.show,
            open: (onComplete?: CallableFunction) => {
                if (typeof onComplete === "function") {
                    loginCallbacks.current.push(onComplete);
                }
                setLoginShow(true);
            },
            close: () => {
                if (loginCallbacks.current.length) {
                    loginCallbacks.current.forEach((method) => method());
                    loginCallbacks.current = [];
                }
                setLoginShow(false);
            },
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
