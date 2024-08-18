/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from "axios";
import { FormEvent, useCallback, useMemo, useState } from "react";

type ToKeyedObject<T, V = boolean> = {
    [K in keyof T]: V;
};

function makeBooleanObject<O extends object>(obj: O) {
    const o = Object.keys(obj).reduce(
        (acc, key) => {
            return { ...acc, [key]: false };
        },
        { ...obj }
    );

    return o as ToKeyedObject<O, boolean>;
}

type Validators<State> = {
    [K in keyof State]?: (value: State[K]) => [isValid: boolean, error: string];
};

type ToValidated<State> = {
    [K in keyof State]: [isValid: boolean, error: string];
};

type ToFields<State> = {
    [K in keyof State]: {
        dirty: boolean;
        focus: boolean;
        value: State[K];
        valid: boolean;
        error: string;
    };
};

export default function useForm<IS extends object>(config: {
    initialState: IS;
    validate: Validators<IS>;
    onSubmit: (data: IS) => Promise<void>;
}) {
    const { initialState, validate, onSubmit } = config;

    const [form, setForm] = useState(initialState);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    const [dirty, setDirty] = useState(makeBooleanObject(initialState));

    const [focus, setFocus] = useState(makeBooleanObject(initialState));

    const valid = useMemo(() => {
        const fields = Object.keys(initialState).reduce((acc, key) => {
            const value = form[key as keyof IS];
            const method =
                validate[key as keyof typeof validate] || (() => [true, ""]);

            return { ...acc, [key]: method(value) };
        }, {});

        return fields as ToValidated<IS>;
    }, [form, initialState, validate]);

    const isValid = useMemo(() => {
        return Object.values(valid).every((v) => {
            return !!(v as [boolean])[0];
        });
    }, [valid]);

    const fields = useMemo(() => {
        const o = Object.keys(initialState).reduce((acc, key) => {
            return {
                ...acc,
                [key]: {
                    value: form[key as keyof IS],
                    dirty: dirty[key as keyof IS],
                    focus: focus[key as keyof IS],
                    valid: valid[key as keyof IS][0],
                    error: valid[key as keyof IS][1],
                },
            };
        }, {});

        return o as ToFields<IS>;
    }, [form, dirty, focus, valid, initialState]);

    const handleSubmit = useCallback(
        async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            setErrorMessage("");

            try {
                setIsSubmitting(true);
                await onSubmit(form);
                resetForm();
            } catch (e) {
                console.log("caught error", e);

                if (e instanceof AxiosError) {
                    setErrorMessage(e.response?.data?.message || e.message);
                } else if (e instanceof Error) {
                    setErrorMessage(e.message);
                }
            } finally {
                setIsSubmitting(false);
            }
        },
        [onSubmit, form]
    );

    const setField = useCallback(
        (
            key: keyof IS,
            {
                dirty,
                value,
                focus,
            }: {
                dirty?: boolean;
                value?: string | number | boolean;
                focus?: boolean;
            }
        ) => {
            if (typeof dirty === "boolean") {
                setDirty((prev) => ({
                    ...prev,
                    [key]: dirty,
                }));
            }
            if (typeof focus === "boolean") {
                setFocus((prev) => ({
                    ...prev,
                    [key]: focus,
                }));
            }
            if (typeof value !== "undefined") {
                setForm((prev) => ({
                    ...prev,
                    [key]: value,
                }));
            }
        },
        [initialState]
    );

    const handleInput = useCallback((e: FormEvent<HTMLInputElement>) => {
        const target = e.currentTarget;

        setField(target.name as keyof IS, {
            value: target.value,
            dirty: target.value.length > 0,
        });
    }, []);

    const handleFocus = useCallback((e: FormEvent<HTMLInputElement>) => {
        const target = e.currentTarget;
        setField(target.name as keyof IS, { focus: true });
    }, []);

    const handleBlur = useCallback((e: FormEvent<HTMLInputElement>) => {
        const target = e.currentTarget;
        setField(target.name as keyof IS, { focus: false });
    }, []);

    const attrs = useMemo(() => {
        return {
            onChange: handleInput,
            onInput: handleInput,
            onFocus: handleFocus,
            onBlur: handleBlur,
        };
    }, [handleInput, handleFocus, handleBlur]);

    const resetForm = useCallback(() => {
        setForm(initialState);
        setDirty(makeBooleanObject(initialState));
        setFocus(makeBooleanObject(initialState));
        setErrorMessage("");
    }, [initialState]);

    return {
        form,
        isSubmitting,
        errorMessage,
        fields,
        attrs,
        isValid,
        resetForm,
        handleSubmit,
        setField,
    };
}
