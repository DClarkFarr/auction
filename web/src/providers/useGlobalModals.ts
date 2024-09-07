import { UseModalConfig } from "../hooks/useModal";
import { contextFactory } from "../utils/context";

export type RegisteredModals = "login" | "signup" | "card" | "bid";
export type RegisteredModalControls = {
    show: boolean;
    open: (onCompleteAction?: () => void, props?: UseModalConfig) => void;
    close: (successCount?: number) => void;
    update: (props: UseModalConfig) => void;
    executeSuccess: (successCount: number) => void;
};

type AllModals = {
    [K in RegisteredModals]: RegisteredModalControls;
};

export type GlobalModalContext = AllModals & {
    executeSuccess: (successCount: number) => void;
};

export const [GlobalModalContext, useGlobalModalContext] =
    contextFactory<GlobalModalContext>();
