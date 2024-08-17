import { Button, Label, TextInput, Alert } from "flowbite-react";
import { FormEvent, ReactNode, useCallback, useMemo, useState } from "react";
import { validateEmail, validatePassword } from "../../utils/validate";
import CheckIcon from "~icons/ic/baseline-check-circle-outline";
import TimesIcon from "~icons/ic/outline-cancel";
import SpinIcon from "~icons/ic/baseline-refresh";
import { cls } from "../../utils/attributes";
import SlideUpDown from "../transition/SlideUpDown";
import { AxiosError } from "axios";

type LoginFormState = {
    email: string;
    password: string;
};

export type LoginFormProps = {
    onSubmit: (data: LoginFormState) => Promise<void>;
};
export function LoginForm({ onSubmit }: LoginFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [dirty, setDirty] = useState({
        email: false,
        password: false,
    });

    const [focus, setFocus] = useState({
        email: false,
        password: false,
    });

    const valid = useMemo(() => {
        const pv = validatePassword(form.password);
        const password = Object.values(pv).every((v) => v);
        const email = validateEmail(form.email);
        return {
            valid: password && email,
            email,
            password: {
                valid: password,
                ...pv,
            },
        };
    }, [form]);

    const resetForm = () => {
        setForm({ email: "", password: "" });
        setDirty({ email: false, password: false });
        setFocus({ email: false, password: false });
        setErrorMessage("");
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
    };

    const handleInput = useCallback((e: FormEvent<HTMLInputElement>) => {
        const target = e.currentTarget;
        setForm((prev) => ({
            ...prev,
            [target.name]: target.value,
        }));

        setDirty((prev) => ({
            ...prev,
            [target.name]: target.value.length > 0,
        }));
    }, []);

    const handleFocus = useCallback((e: FormEvent<HTMLInputElement>) => {
        const target = e.currentTarget;
        setFocus((prev) => ({
            ...prev,
            [target.name]: true,
        }));
    }, []);

    const handleBlur = useCallback((e: FormEvent<HTMLInputElement>) => {
        const target = e.currentTarget;
        setFocus((prev) => ({
            ...prev,
            [target.name]: false,
        }));
    }, []);

    return (
        <form
            className="flex max-w-md flex-col gap-4 bg-gray-100 p-6"
            onSubmit={handleSubmit}
        >
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="email" value="Your email" />
                </div>
                <TextInput
                    id="email"
                    name="email"
                    type="email"
                    placeholder="example@email.com"
                    color={
                        !focus.email && dirty.email && !valid.email
                            ? "failure"
                            : undefined
                    }
                    required
                    onInput={handleInput}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    value={form.email}
                    helperText={
                        !focus.email &&
                        dirty.email &&
                        !valid.email && <div>Email is not valid</div>
                    }
                />
            </div>
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="password" value="Your password" />
                </div>
                <TextInput
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={form.password}
                    onInput={handleInput}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
                <SlideUpDown show={focus.password || valid.password.valid}>
                    <div className="flex flex-col w-full text-xs pt-2">
                        <PasswordLine valid={valid.password.hasNumber}>
                            {valid.password.hasNumber
                                ? "Has 1+ number"
                                : "Must have 1+ a number"}
                        </PasswordLine>
                        <PasswordLine valid={valid.password.hasLowerCase}>
                            {valid.password.hasLowerCase
                                ? "Has 1+ lower case char"
                                : "Must have 1+ lower case char"}
                        </PasswordLine>
                        <PasswordLine valid={valid.password.hasUpperCase}>
                            {valid.password.hasUpperCase
                                ? "Has 1+ upper case char"
                                : "Must have 1+ upper case char"}
                        </PasswordLine>
                        <PasswordLine valid={valid.password.hasSpecialChar}>
                            {valid.password.hasSpecialChar
                                ? "Has 1+ special char (!@#$%^&*)"
                                : "Must have 1+ special char (!@#$%^&*))"}
                        </PasswordLine>
                        <PasswordLine valid={valid.password.isOver8Char}>
                            {valid.password.isOver8Char
                                ? "Has 8+ characters"
                                : "Must have 8+ characters"}
                        </PasswordLine>
                    </div>
                </SlideUpDown>
            </div>

            {errorMessage && (
                <Alert className="mb-4" color="failure">
                    {errorMessage}
                </Alert>
            )}

            <Button type="submit" disabled={isSubmitting || !valid.valid}>
                {isSubmitting ? (
                    <div className="flex gap-x-2">
                        <div>
                            <SpinIcon className="animate-spin" />
                        </div>
                        Logging in...
                    </div>
                ) : (
                    "Log in"
                )}
            </Button>
        </form>
    );
}

const PasswordLine = ({
    valid,
    children,
}: {
    valid: boolean;
    children: ReactNode;
}) => {
    return (
        <div
            className={cls(
                "flex gap-x-2 items-center",
                valid ? "text-green-500" : "text-red-500"
            )}
        >
            <div className="shrink w-2">
                {valid ? <CheckIcon /> : <TimesIcon />}
            </div>
            <div className="grow">{children}</div>
        </div>
    );
};
