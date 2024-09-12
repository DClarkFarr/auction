/* eslint-disable @typescript-eslint/no-explicit-any */
import { Label, Popover, TextInput, TextInputProps } from "flowbite-react";
import React, { FormEvent, ReactNode } from "react";
import QuestionIcon from "~icons/ic/baseline-contact-support";

type BaseInputProps = {
    name: string;
    field: {
        focus: boolean;
        dirty: boolean;
        valid: boolean;
        error: string;
        value: string | number;
    };

    isSubmitting: boolean;
    label?: string | ReactNode;
    disabled?: boolean;
    tooltip?: string | ReactNode;
    showInitialError?: boolean;
    placeholder?: string;
    type?: TextInputProps["type"];
    attrs: Partial<{
        onChange: (e: FormEvent<HTMLInputElement>) => void;
        onInput: (e: FormEvent<HTMLInputElement>) => void;
        onFocus: (e: FormEvent<HTMLInputElement>) => void;
        onBlur: (e: FormEvent<HTMLInputElement>) => void;
    }>;
};

type AsProps<T> = T extends React.ComponentType<infer P> ? P : never;

type AsRef<T> = T extends React.ForwardRefExoticComponent<
    object & React.RefAttributes<infer R>
>
    ? R
    : T extends React.LegacyRef<infer RR>
    ? RR
    : never;

type QuickInputProps<C extends React.ComponentType<any>> = BaseInputProps &
    AsProps<C> & {
        as?: C;
    };

const QuickInput = React.forwardRef(
    <C extends React.ComponentType<any>>(
        {
            as,
            isSubmitting,
            name,
            disabled,
            placeholder,
            field,
            attrs,
            label,
            tooltip,
            type = "text",
            showInitialError = true,
            ...rest
        }: QuickInputProps<C>,
        ref: React.Ref<AsRef<C>>
    ) => {
        const Component = as || TextInput;

        const content = (
            <div className="p-4 max-w-[250px] text-center bg-gray-800 text-white text-xs">
                {tooltip || ""}
            </div>
        );
        return (
            <div>
                {label && (
                    <div className="mb-2 block">
                        {typeof label === "string" ? (
                            <div className="flex gap-x-2">
                                <Label htmlFor={name} value={label} />
                                {tooltip && (
                                    <Popover
                                        theme={{
                                            arrow: {
                                                base: "absolute h-2 w-2 z-0 rotate-45 bg-gray-600 border border-gray-800 bg-gray-800",
                                            },
                                        }}
                                        placement="top"
                                        trigger="hover"
                                        content={content}
                                    >
                                        <div>
                                            <QuestionIcon className="text-gray-500" />
                                        </div>
                                    </Popover>
                                )}
                            </div>
                        ) : (
                            label
                        )}
                    </div>
                )}

                <Component
                    id={name}
                    name={name}
                    type={type}
                    ref={ref}
                    placeholder={placeholder}
                    disabled={isSubmitting || disabled}
                    color={
                        ((!field.focus && field.dirty) || showInitialError) &&
                        !field.valid
                            ? "failure"
                            : undefined
                    }
                    value={field.value}
                    helperText={
                        !field.focus &&
                        field.dirty &&
                        !field.valid &&
                        field.error
                    }
                    {...attrs}
                    {...rest}
                />
            </div>
        );
    }
);

export default QuickInput;
