import { createPortal } from "react-dom";
import { GlobalModalContext, RegisteredModals } from "./useGlobalModals";
import React from "react";
import { useModal, UseModalConfig } from "../hooks/useModal";
import LoginFormModal from "../components/modal/LoginFormModal";
import SignupFormModal from "../components/modal/SignupFormModal";
import PaymentMethodModal from "../components/modal/PaymentMethodModal";

type UseModal = ReturnType<typeof useModal>;
type ModalState = UseModal["state"];
type ModalMethods = Omit<UseModal, "state">;

function GlobalModalProviderComponent({
    children,
    teleportRef,
}: {
    children: React.ReactNode;
    teleportRef: React.RefObject<HTMLDivElement>;
}) {
    const { state: signupState, ...signupMethods } = useModal({
        show: false,
    });

    const { state: loginState, ...loginMethods } = useModal({
        show: false,
    });

    const { state: cardState, ...cardMethods } = useModal({
        show: false,
    });

    const openedModal = React.useRef<false | RegisteredModals>(false);

    console.log(
        "rendering GlobalModalProvider, openModal",
        openedModal.current
    );

    const successCallbacks = React.useRef<CallableFunction[]>([]);

    const closeOthers = (modalKey: RegisteredModals) => {
        console.log("closing others", modalKey);
        const map: Record<RegisteredModals, CallableFunction> = {
            signup: () => signupState.show && signupMethods.close(),
            login: () => loginState.show && loginMethods.close(),
            card: () => cardState.show && cardMethods.close(),
        };

        if (openedModal.current) {
            map[openedModal.current]();
            openedModal.current = false;
        }
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

    const bindModal = (
        name: RegisteredModals,
        s: ModalState,
        m: ModalMethods
    ) => {
        return {
            show: s.show,
            open: (
                onComplete?: CallableFunction,
                props: UseModalConfig = {}
            ) => {
                closeOthers(name);

                openedModal.current = name;

                if (typeof onComplete === "function") {
                    successCallbacks.current.push(onComplete);
                }
                m.open(props);
            },
            close: (successCount = 0) => {
                m.close();
                executeSuccess(successCount);
                if (openedModal.current === name) {
                    console.log("close() -> openedModal = false");
                    openedModal.current = false;
                }
            },
            update: (p: UseModalConfig) => {
                m.setState(p);
            },
            executeSuccess,
        };
    };

    const login = React.useMemo(
        () => bindModal("login", loginState, loginMethods),
        [loginState]
    );

    const signup = React.useMemo(
        () => bindModal("signup", signupState, signupMethods),
        [signupState]
    );

    const card = React.useMemo(
        () => bindModal("card", cardState, cardMethods),
        [cardState]
    );

    return (
        <GlobalModalContext.Provider
            value={{
                signup,
                login,
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

const GlobalModalProvider = React.memo(GlobalModalProviderComponent);

export default GlobalModalProvider;
