import { contextFactory } from "../utils/context";

export type RegisteredModals = "login"; //  | "signup" | "card";
export type RegisteredModalControls = {
    show: boolean;
    open: (onCompleteAction?: () => void) => void;
    close: () => void;
};

type AllModals = {
    [K in RegisteredModals]: RegisteredModalControls;
};

export type GlobalModalContext = AllModals;

export const [GlobalModalContext, useGlobalModalContext] =
    contextFactory<GlobalModalContext>();
