import { Button, Label, TextInput, Alert } from "flowbite-react";
import { ReactNode, useMemo } from "react";
import { validatePassword } from "../../utils/validate";
import useForm from "../../hooks/useForm";
import SlideUpDown from "../transition/SlideUpDown";
import CheckIcon from "~icons/ic/baseline-check-circle-outline";
import TimesIcon from "~icons/ic/outline-cancel";
import { cls } from "../../utils/attributes";

type ForgotPasswordResetFormState = {
    code: string;
    password: string;
    passwordConfirm: string;
};

export type ForgotPasswordResetFormProps = {
    footer?: ReactNode;
    onSubmit: (data: ForgotPasswordResetFormState) => Promise<void>;
};

const initialState = {
    code: "",
    password: "",
    passwordConfirm: "",
};

export default function ForgotPasswordResetForm({
    onSubmit,
    footer,
}: ForgotPasswordResetFormProps) {
    const validate = useMemo(() => {
        return {
            code: (v: string) => {
                const valid = v.length === 6 && /^\d+$/.test(v);

                return [valid, valid ? "" : "Code must contain 6 digits"] as [
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
            passwordConfirm: (
                v: string,
                state: ForgotPasswordResetFormState
            ) => {
                const valid = v === state.password;

                return [valid, valid ? "" : "Passwords do not match"] as [
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
        fields: { code, password, passwordConfirm },
        attrs,
    } = useForm<ForgotPasswordResetFormState>({
        initialState,
        validate,
        onSubmit,
    });

    const passwordCriteria = useMemo(() => {
        return validatePassword(password.value);
    }, [password.value]);

    return (
        <div className="max-w-full">
            <form
                className="flex flex-col gap-4 bg-gray-100 p-6"
                onSubmit={handleSubmit}
            >
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="code" value="Reset Code" />
                    </div>
                    <TextInput
                        id="code"
                        name="code"
                        type="code"
                        color={
                            !code.focus && code.dirty && !code.valid
                                ? "failure"
                                : undefined
                        }
                        required
                        value={code.value}
                        helperText={
                            !code.focus &&
                            code.dirty &&
                            !code.valid &&
                            code.error
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
                <div>
                    <div className="mb-2 block">
                        <Label
                            htmlFor="passwordConfirm"
                            value="Confirm password"
                        />
                    </div>
                    <TextInput
                        id="passwordConfirm"
                        name="passwordConfirm"
                        type="password"
                        required
                        value={passwordConfirm.value}
                        color={
                            passwordConfirm.dirty && !passwordConfirm.valid
                                ? "failure"
                                : undefined
                        }
                        helperText={
                            passwordConfirm.error &&
                            passwordConfirm.dirty &&
                            passwordConfirm.error
                        }
                        {...attrs}
                    />
                </div>

                {errorMessage && (
                    <Alert className="mb-4" color="failure">
                        {errorMessage}
                    </Alert>
                )}

                <Button
                    isProcessing={isSubmitting}
                    type="submit"
                    disabled={isSubmitting || !isValid}
                >
                    {isSubmitting ? "Resetting..." : "Reset password"}
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
