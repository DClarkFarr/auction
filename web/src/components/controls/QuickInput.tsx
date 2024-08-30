/* eslint-disable @typescript-eslint/no-explicit-any */
import { Label, Popover, TextInput, TextInputProps } from "flowbite-react";
import { FormEvent, ReactNode } from "react";
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

type QuickInputProps<Component extends (props: BaseInputProps) => any> = Record<
    string,
    any
> &
    BaseInputProps & {
        as?: Component | ((props: Parameters<Component>[0]) => ReactNode);
    };

export default function QuickInput<Component extends (args: any) => ReactNode>({
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
}: QuickInputProps<Component>) {
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
                    !field.focus && field.dirty && !field.valid && field.error
                }
                {...attrs}
                {...rest}
            />
        </div>
    );
}
