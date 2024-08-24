import {
    createContext,
    PropsWithChildren,
    ReactNode,
    useEffect,
    useState,
} from "react";
import { createPortal } from "react-dom";
import {
    AnimatePresence,
    LayoutGroup,
    motion,
    useAnimate,
} from "framer-motion";

import {
    FailureToast,
    InfoToast,
    SuccessToast,
    ToastComponent,
    WarningToast,
} from "../components/controls/Toast";
import useToastContext from "./useToastContext";
import { uniqueId } from "lodash-es";

export type ToastConfig = {
    text: string | ReactNode;
    type: "success" | "failure" | "info" | "warning";
    duration: number;
    id: string;
    createdAt: number;
    dismiss: () => void;
};

export type ToastResponse = {
    id: string;
    dismiss: () => void;
};
export type ToastContext = {
    toasts: ToastConfig[];
    toast: (options: {
        text: string;
        duration?: number;
        type?: ToastConfig["type"];
    }) => ToastResponse;
};

const typeMap: Record<ToastConfig["type"], ToastComponent> = {
    success: SuccessToast,
    info: InfoToast,
    warning: WarningToast,
    failure: FailureToast,
};

export const ToastContext = createContext({} as ToastContext);

export default function ToastProvider({ children }: PropsWithChildren<object>) {
    const [toasts, setToasts] = useState<ToastConfig[]>([]);

    const toast: ToastContext["toast"] = ({
        text,
        duration = 5000,
        type = "info",
    }) => {
        const id = uniqueId();

        const timeoutId = window.setTimeout(() => {
            dismiss();
        }, duration);

        const dismiss = () => {
            window.clearTimeout(timeoutId);
            setToasts((prev) => prev.filter((t) => t.id !== id));
        };

        setToasts((prev) => {
            const toSet = {
                id,
                text,
                duration,
                type,
                dismiss,
                createdAt: Math.floor(Date.now() / 1000),
            };

            if (
                prev.find(
                    (p) =>
                        p.createdAt === toSet.createdAt && p.text === toSet.text
                )
            ) {
                return prev;
            }

            return [toSet, ...prev];
        });

        return {
            id,
            dismiss,
        };
    };
    return (
        <ToastContext.Provider value={{ toasts, toast }}>
            {children}
            {createPortal(
                <div className="toasts">
                    <ToastManager />
                </div>,
                document.body
            )}
        </ToastContext.Provider>
    );
}

function ToastManager() {
    const { toasts } = useToastContext();

    return (
        <>
            <LayoutGroup id="toasts">
                <AnimatePresence>
                    {toasts.map((config, index) => {
                        const Component = typeMap[config.type];

                        return (
                            <ToastWrapper
                                {...config}
                                index={index}
                                key={config.id}
                            >
                                <Component onDismiss={config.dismiss}>
                                    {config.text}
                                </Component>
                            </ToastWrapper>
                        );
                    })}
                </AnimatePresence>
            </LayoutGroup>
        </>
    );
}

function ToastWrapper({
    children,
    index,
}: PropsWithChildren<ToastConfig & { index: number }>) {
    const [ref, groupAnimate] = useAnimate();
    const [initialTop] = useState(79 * index + 80 + "px");

    const currentTop = 79 * index + 80 + "px";

    useEffect(() => {
        const { stop } = groupAnimate(ref.current, { top: currentTop });

        return () => stop();
    }, [currentTop]);

    return (
        <motion.div
            style={{ top: initialTop }}
            initial={{ right: -200 }}
            whileInView={{ right: 10 }}
            exit={{ right: -300 }}
            ref={ref}
            className="fixed"
        >
            {children}
        </motion.div>
    );
}
