import { ModalProps } from "flowbite-react";
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

export type ModalState = {
    onClose?: () => void;
    position?: ModalProps["position"];
    popup?: boolean;
    root?: HTMLElement;
    show?: boolean;
    size?: ModalProps["size"];
    dismissible?: boolean;
    theme?: ModalProps["theme"];
    initialFocus?: ModalProps["initialFocus"];
};
export type RegisteredModals = "login" | "signup" | "card" | "bid" | "purchase";
export type CloseIntentCallback = () => void;
export type CloseIntentScope = RegisteredModals;
export type CloseIntentProps = {
    callback: CloseIntentCallback;
    scope: CloseIntentScope;
};

export type ModalActions = {
    open: (props?: ModalState, closeIntent?: CloseIntentProps) => void;
    close: (executeIntent?: boolean) => void;
    update: (props: ModalState) => void;
    invokeIntents: () => void;
    transferIntents: (fromModal: RegisteredModals) => void;
};

export type RegisteredModal = {
    name: RegisteredModals;
    state: ModalState;
    actions: ModalActions;
};

export type UseModalsStore = {
    [K in RegisteredModals]: RegisteredModal;
} & {
    intents: CloseIntentProps[];
    addIntent: (intent: CloseIntentProps) => void;
    invokeIntents: (scope: CloseIntentScope) => void;
    transferIntents: (
        fromModal: RegisteredModals,
        toModal: RegisteredModals
    ) => void;
};

const makeInitialState = (onClose: () => void): ModalState => ({
    onClose,
    show: false,
    position: "center",
    size: "lg",
    dismissible: true,
});

const useModalsStore = create<UseModalsStore>((set, get) => {
    const setter = (props: Partial<UseModalsStore>) => {
        set((prev) => {
            const toSet = { ...prev, ...props };
            return toSet;
        });
    };

    const addIntent = (i: CloseIntentProps) => {
        const is = get().intents;

        setter({ intents: [...is, i] });
    };

    const invokeIntents = (scope: CloseIntentScope) => {
        const intents = get().intents;

        intents
            .filter((it) => it.scope === scope)
            .forEach((it) => it.callback());

        setter({ intents: intents.filter((it) => it.scope !== scope) });
    };

    const transferIntents = (
        fromModal: RegisteredModals,
        toModal: RegisteredModals
    ) => {
        setter({
            intents: get().intents.map((it) =>
                it.scope === fromModal ? { ...it, scope: toModal } : it
            ),
        });
    };

    const modalStateSetter = (name: RegisteredModals, state: ModalState) => {
        const m = get()[name];
        const toSet = {
            [name]: { ...m, state: { ...m.state, ...state } },
        };

        setter(toSet);
    };
    const makeRegisteredModal = (name: RegisteredModals): RegisteredModal => {
        const close = (executeIntent = false) => {
            modalStateSetter(name, { show: false });

            if (executeIntent) {
                invokeIntents(name);
            }
        };
        return {
            name,
            state: makeInitialState(close),
            actions: {
                open: (props = {}, callbackIntent = undefined) => {
                    modalStateSetter(name, { ...props, show: true });

                    if (callbackIntent) {
                        addIntent(callbackIntent);
                    }
                },
                close,
                update: (state) => {
                    modalStateSetter(name, state);
                },
                invokeIntents: () => invokeIntents(name),
                transferIntents: (fromModal) => {
                    transferIntents(fromModal, name);
                },
            },
        };
    };

    return {
        login: makeRegisteredModal("login"),
        signup: makeRegisteredModal("signup"),
        card: makeRegisteredModal("card"),
        bid: makeRegisteredModal("bid"),
        purchase: makeRegisteredModal("purchase"),
        intents: [],
        addIntent,
        invokeIntents,
        transferIntents,
    };
});

export default useModalsStore;

export const useLoginModal = () => {
    return useModalsStore(
        useShallow((state) => ({
            state: state.login.state,
            ...state.login.actions,
        }))
    );
};

export const useSignupModal = () => {
    return useModalsStore(
        useShallow((state) => ({
            state: state.signup.state,
            ...state.signup.actions,
        }))
    );
};

export const useCardModal = () => {
    return useModalsStore(
        useShallow((state) => ({
            state: state.card.state,
            ...state.card.actions,
        }))
    );
};

export const useBidModal = () => {
    return useModalsStore(
        useShallow((state) => ({
            state: state.bid.state,
            ...state.bid.actions,
        }))
    );
};

export const usePurchaseModal = () => {
    return useModalsStore(
        useShallow((state) => ({
            state: state.purchase.state,
            ...state.purchase.actions,
        }))
    );
};
