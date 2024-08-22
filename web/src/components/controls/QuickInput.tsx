import { Label, Popover, TextInput, TextInputProps } from "flowbite-react";
import { FormEvent, ReactNode } from "react";
import QuestionIcon from "~icons/ic/baseline-contact-support";

export default function QuickInput<Component extends () => ReactNode>({
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
}: {
    name: string;
    field: {
        focus: boolean;
        dirty: boolean;
        valid: boolean;
        error: string;
        value: string | number;
    };
    as?: Component;
    isSubmitting: boolean;
    label?: string | ReactNode;
    placeholder?: string;
    disabled?: boolean;
    type?: TextInputProps["type"];
    tooltip?: string | ReactNode;
    attrs: Partial<{
        onChange: (e: FormEvent<HTMLInputElement>) => void;
        onInput: (e: FormEvent<HTMLInputElement>) => void;
        onFocus: (e: FormEvent<HTMLInputElement>) => void;
        onBlur: (e: FormEvent<HTMLInputElement>) => void;
    }>;
}) {
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
                    !field.focus && field.dirty && !field.valid
                        ? "failure"
                        : undefined
                }
                required
                value={field.value}
                helperText={
                    !field.focus && field.dirty && !field.valid && field.error
                }
                {...attrs}
            />
        </div>
    );
}
