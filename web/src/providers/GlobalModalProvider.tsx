import { createPortal } from "react-dom";
import { GlobalModalContext, RegisteredModals } from "./useGlobalModals";
import React from "react";
import { useModal, UseModalConfig } from "../hooks/useModal";
import LoginFormModal from "../components/modal/LoginFormModal";
import SignupFormModal from "../components/modal/SignupFormModal";
import PaymentMethodModal from "../components/modal/PaymentMethodModal";

type UseModal = ReturnType<typeof useModal>;
type LoginState = UseModal["state"];
type LoginMethods = Omit<UseModal, "state">;

export default function GlobalModalProvider({
    children,
    teleportRef,
}: {
    children: React.ReactNode;
    teleportRef: React.RefObject<HTMLDivElement>;
}) {
    const { state: loginState, ...loginMethods } = useModal({
        show: false,
    });

    const { state: signupState, ...signupMethods } = useModal({
        show: false,
    });

    const { state: cardState, ...cardMethods } = useModal({
        show: false,
    });

    const successCallbacks = React.useRef<CallableFunction[]>([]);

    const closeOthers = (modalKey: RegisteredModals) => {
        const map: Record<RegisteredModals, CallableFunction> = {
            login: () => loginState.show && loginMethods.close(),
            signup: () => signupState.show && signupMethods.close(),
            card: () => cardState.show && cardMethods.close(),
        };

        Object.entries(map).forEach(([key, method]) => {
            if (key !== modalKey) {
                method();
            }
        });
    };

    const executeSuccess = (successCount: number) => {
        if (successCount === Infinity) {
            successCallbacks.current.forEach((next) => {
                next();
            });
            successCallbacks.current = [];
            return;
        }

        if (successCount > 0) {
            for (let i = 0; i < successCount; i++) {
                const next = successCallbacks.current.pop();
                if (!next) {
                    break;
                }

                next();
            }
        }
    };

    const bindModal = (s: LoginState, m: LoginMethods) => {
        return {
            show: s.show,
            open: (
                onComplete?: CallableFunction,
                props: UseModalConfig = {}
            ) => {
                closeOthers("login");

                if (typeof onComplete === "function") {
                    successCallbacks.current.push(onComplete);
                }
                m.open(props);
            },
            close: (successCount = 0) => {
                m.close();
                executeSuccess(successCount);
            },
            update: (p: UseModalConfig) => {
                m.setState(p);
            },
            executeSuccess,
        };
    };

    const login = React.useMemo(
        () => bindModal(loginState, loginMethods),
        [loginState]
    );

    const signup = React.useMemo(
        () => bindModal(signupState, signupMethods),
        [signupState]
    );

    const card = React.useMemo(
        () => bindModal(cardState, cardMethods),
        [cardState]
    );

    return (
        <GlobalModalContext.Provider
            value={{
                login,
                signup,
                card,
                executeSuccess,
            }}
        >
            {children}
            {teleportRef.current &&
                createPortal(
                    <>
                        <LoginFormModal {...loginState} />
                        <SignupFormModal {...signupState} />
                        <PaymentMethodModal {...cardState} />
                    </>,
                    teleportRef.current
                )}
        </GlobalModalContext.Provider>
    );
}
