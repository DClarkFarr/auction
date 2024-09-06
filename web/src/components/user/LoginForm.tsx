import { Button, Label, TextInput, Alert } from "flowbite-react";
import { ReactNode, useMemo } from "react";
import { validateEmail, validatePassword } from "../../utils/validate";
import SpinIcon from "~icons/ic/baseline-refresh";
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
                const valid = validatePassword(v).isOver8Char;

                return [valid, valid ? "" : "Password is not valid"] as [
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

    return (
        <div className="max-w-full">
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
                        color={
                            !password.focus && password.dirty && !password.valid
                                ? "failure"
                                : undefined
                        }
                        helperText={
                            !password.focus &&
                            password.dirty &&
                            !password.valid &&
                            password.error
                        }
                        {...attrs}
                    />
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
