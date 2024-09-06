import { createPortal } from "react-dom";
import { GlobalModalContext, RegisteredModals } from "./useGlobalModals";
import React from "react";
import { useModal } from "../hooks/useModal";
import LoginFormModal from "../components/modal/LoginFormModal";
import SignupFormModal from "../components/modal/SignupFormModal";

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

    const { setShow: setSignupShow, ...signupModalProps } = useModal({
        show: false,
    });

    const successCallbacks = React.useRef<CallableFunction[]>([]);

    const closeOthers = (modalKey: RegisteredModals) => {
        const map: Record<RegisteredModals, CallableFunction> = {
            login: () => setLoginShow(false),
            signup: () => setSignupShow(false),
        };

        Object.entries(map).forEach(([key, method]) => {
            if (key !== modalKey) {
                method();
            }
        });
    };

    const login = React.useMemo(() => {
        return {
            show: loginModalProps.show,
            open: (onComplete?: CallableFunction) => {
                closeOthers("login");

                if (typeof onComplete === "function") {
                    successCallbacks.current.push(onComplete);
                }
                setLoginShow(true);
            },
            close: () => {
                setLoginShow(false);
            },
        };
    }, [loginModalProps, setLoginShow]);

    const signup = React.useMemo(() => {
        return {
            show: signupModalProps.show,
            open: (onComplete?: CallableFunction) => {
                closeOthers("signup");

                if (typeof onComplete === "function") {
                    successCallbacks.current.push(onComplete);
                }
                setSignupShow(true);
            },
            close: () => {
                setSignupShow(false);
            },
        };
    }, [signupModalProps, setSignupShow]);

    const onSuccess = React.useCallback(() => {
        successCallbacks.current.forEach((m) => m());
        successCallbacks.current = [];
    }, []);

    return (
        <GlobalModalContext.Provider
            value={{
                login,
                signup,
                onSuccess,
            }}
        >
            {children}
            {teleportRef.current &&
                createPortal(
                    <>
                        <LoginFormModal {...loginModalProps} />
                        <SignupFormModal {...signupModalProps} />
                    </>,
                    teleportRef.current
                )}
        </GlobalModalContext.Provider>
    );
}
