import { Toast, ToastProps } from "flowbite-react";

import CheckIcon from "~icons/ic/baseline-check";
import TimesIcon from "~icons/ic/baseline-close";
import WarningIcon from "~icons/ic/baseline-warning";
import InfoIcon from "~icons/ic/baseline-offline-bolt";
import { FC, PropsWithChildren } from "react";

export type ToastComponent = FC<
    PropsWithChildren<{
        className?: string;
        onDismiss: () => void;
        theme?: ToastProps["theme"];
    }>
>;

export const InfoToast: ToastComponent = ({
    className,
    children,
    onDismiss,
    theme,
}) => {
    return (
        <Toast className={[className, "min-w-[220px]"].join(" ")} theme={theme}>
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-sky-500 dark:bg-sky-800 dark:text-sky-200">
                <InfoIcon className="h-5 w-5" />
            </div>
            <div className="ml-3 text-sm font-normal">{children}</div>
            <Toast.Toggle onDismiss={onDismiss} />
        </Toast>
    );
};

export const SuccessToast: ToastComponent = ({
    className,
    children,
    onDismiss,
    theme,
}) => {
    return (
        <Toast className={[className, "min-w-[220px]"].join(" ")} theme={theme}>
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                <CheckIcon className="h-5 w-5" />
            </div>
            <div className="ml-3 text-sm font-normal">{children}</div>
            <Toast.Toggle onDismiss={onDismiss} />
        </Toast>
    );
};

export const FailureToast: ToastComponent = ({
    className,
    children,
    onDismiss,
    theme,
}) => {
    return (
        <Toast className={[className, "min-w-[220px]"].join(" ")} theme={theme}>
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                <TimesIcon className="h-5 w-5" />
            </div>
            <div className="ml-3 text-sm font-normal">{children}</div>
            <Toast.Toggle onDismiss={onDismiss} />
        </Toast>
    );
};

export const WarningToast: ToastComponent = ({
    className,
    children,
    onDismiss,
    theme,
}) => {
    return (
        <Toast className={[className, "min-w-[220px]"].join(" ")} theme={theme}>
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
                <WarningIcon className="h-5 w-5" />
            </div>
            <div className="ml-3 text-sm font-normal">{children}</div>
            <Toast.Toggle onDismiss={onDismiss} />
        </Toast>
    );
};
