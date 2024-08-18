import { Button, Label, TextInput, Alert } from "flowbite-react";
import { ReactNode, useMemo } from "react";
import { validateEmail, validatePassword } from "../../utils/validate";
import CheckIcon from "~icons/ic/baseline-check-circle-outline";
import TimesIcon from "~icons/ic/outline-cancel";
import SpinIcon from "~icons/ic/baseline-refresh";
import { cls } from "../../utils/attributes";
import SlideUpDown from "../transition/SlideUpDown";
import useForm from "../../hooks/useForm";

type LoginFormState = {
    email: string;
    password: string;
};

export type LoginFormProps = {
    footer?: ReactNode;
    onSubmit: (data: LoginFormState) => Promise<void>;
};

const initialState = {
    email: "",
    password: "",
};

export default function LoginForm({ onSubmit, footer }: LoginFormProps) {
    const validate = useMemo(() => {
        return {
            email: (v: string) => {
                const valid = validateEmail(String(v));

                return [valid, valid ? "" : "Email is not valid"] as [
                    boolean,
                    string
                ];
            },
            password: (v: string) => {
                const allValid = Object.values(
                    validatePassword(String(v))
                ).every(Boolean);

                return [allValid, allValid ? "" : "Password is not valid"] as [
                    boolean,
                    string
                ];
            },
        };
    }, []);

    const {
        isSubmitting,
        errorMessage,
        handleSubmit,
        isValid,
        fields: { email, password },
        attrs,
    } = useForm<LoginFormState>({
        initialState,
        validate,
        onSubmit,
    });

    const passwordCriteria = useMemo(() => {
        return validatePassword(password.value);
    }, [password.value]);

    return (
        <div className="max-w-md">
            <form
                className="flex flex-col gap-4 bg-gray-100 p-6"
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
                            !email.focus && email.dirty && !email.valid
                                ? "failure"
                                : undefined
                        }
                        required
                        value={email.value}
                        helperText={
                            !email.focus &&
                            email.dirty &&
                            !email.valid &&
                            email.error
                        }
                        {...attrs}
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
                        value={password.value}
                        {...attrs}
                    />
                    <SlideUpDown show={password.focus || password.valid}>
                        <div className="flex flex-col w-full text-xs pt-2">
                            <PasswordLine valid={passwordCriteria.hasNumber}>
                                {passwordCriteria.hasNumber
                                    ? "Has 1+ number"
                                    : "Must have 1+ a number"}
                            </PasswordLine>
                            <PasswordLine valid={passwordCriteria.hasLowerCase}>
                                {passwordCriteria.hasLowerCase
                                    ? "Has 1+ lower case char"
                                    : "Must have 1+ lower case char"}
                            </PasswordLine>
                            <PasswordLine valid={passwordCriteria.hasUpperCase}>
                                {passwordCriteria.hasUpperCase
                                    ? "Has 1+ upper case char"
                                    : "Must have 1+ upper case char"}
                            </PasswordLine>
                            <PasswordLine
                                valid={passwordCriteria.hasSpecialChar}
                            >
                                {passwordCriteria.hasSpecialChar
                                    ? "Has 1+ special char (!@#$%^&*)"
                                    : "Must have 1+ special char (!@#$%^&*))"}
                            </PasswordLine>
                            <PasswordLine valid={passwordCriteria.isOver8Char}>
                                {passwordCriteria.isOver8Char
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

                <Button type="submit" disabled={isSubmitting || !isValid}>
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
            {footer && <div className="mt-4">{footer}</div>}
        </div>
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
