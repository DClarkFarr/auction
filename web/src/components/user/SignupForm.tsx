import { Button, Label, TextInput, Alert } from "flowbite-react";
import {
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { validateEmail, validatePassword } from "../../utils/validate";
import CheckIcon from "~icons/ic/baseline-check-circle-outline";
import TimesIcon from "~icons/ic/outline-cancel";
import { cls } from "../../utils/attributes";
import SlideUpDown from "../transition/SlideUpDown";
import useForm from "../../hooks/useForm";
import RecaptchaProvider from "../../providers/RecaptchaProvider";
import { GoogleReCaptcha } from "react-google-recaptcha-v3";

type SignupFormState = {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
};

export type SignupFormProps = {
    footer?: ReactNode;
    onSubmit: (data: SignupFormState & { token: string }) => Promise<void>;
};

const initialState: SignupFormState = {
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
};

export default function SignupForm({ onSubmit, footer }: SignupFormProps) {
    const [token, setToken] = useState("");
    const [refreshReCaptcha, setRefreshReCaptcha] = useState(false);
    const refreshTimeoutId = useRef<number | null>(null);

    const validate = useMemo(() => {
        return {
            name: (v: string) => {
                return [
                    v.length > 0,
                    v.length > 0 ? "" : "Name is required",
                ] as [boolean, string];
            },
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
            passwordConfirm: (v: string, state: SignupFormState) => {
                const valid = v === state.password;

                return [valid, valid ? "" : "Passwords do not match"] as [
                    boolean,
                    string
                ];
            },
        };
    }, []);

    const startTimeout = () => {
        if (refreshTimeoutId.current) {
            window.clearTimeout(refreshTimeoutId.current);
        }
        refreshTimeoutId.current = window.setTimeout(() => {
            refreshToken();
        }, 1000 * 55 * 2); // just short of 2 min
    };

    const refreshToken = () => {
        setRefreshReCaptcha((r) => !r);
        startTimeout();
    };

    const onSubmitWithToken = useCallback(
        async (state: SignupFormState) => {
            refreshToken();
            await onSubmit({ ...state, token });
        },
        [token]
    );

    useEffect(() => {
        startTimeout();

        return () => {
            if (refreshTimeoutId.current) {
                window.clearTimeout(refreshTimeoutId.current);
            }
        };
    }, []);

    const {
        isSubmitting,
        errorMessage,
        handleSubmit,
        isValid,
        fields: { name, email, password, passwordConfirm },
        attrs,
    } = useForm<SignupFormState>({
        initialState,
        validate,
        onSubmit: onSubmitWithToken,
    });

    const passwordCriteria = useMemo(() => {
        return validatePassword(password.value);
    }, [password.value]);

    const onVerifyToken = useCallback((t: string) => {
        setToken(t);
    }, []);

    return (
        <div className="max-w-md">
            <RecaptchaProvider>
                <form
                    className="flex flex-col gap-4 bg-gray-100 p-6"
                    onSubmit={handleSubmit}
                >
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="name" value="First & Last Name" />
                        </div>
                        <TextInput
                            id="name"
                            name="name"
                            type="text"
                            placeholder="John Doe"
                            color={
                                !name.focus && name.dirty && !name.valid
                                    ? "failure"
                                    : undefined
                            }
                            required
                            value={name.value}
                            helperText={
                                !name.focus &&
                                name.dirty &&
                                !name.valid &&
                                name.error
                            }
                            {...attrs}
                        />
                    </div>
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
                                <PasswordLine
                                    valid={passwordCriteria.hasNumber}
                                >
                                    {passwordCriteria.hasNumber
                                        ? "Has 1+ number"
                                        : "Must have 1+ a number"}
                                </PasswordLine>
                                <PasswordLine
                                    valid={passwordCriteria.hasLowerCase}
                                >
                                    {passwordCriteria.hasLowerCase
                                        ? "Has 1+ lower case char"
                                        : "Must have 1+ lower case char"}
                                </PasswordLine>
                                <PasswordLine
                                    valid={passwordCriteria.hasUpperCase}
                                >
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
                                <PasswordLine
                                    valid={passwordCriteria.isOver8Char}
                                >
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

                    <GoogleReCaptcha
                        onVerify={onVerifyToken}
                        refreshReCaptcha={refreshReCaptcha}
                    />

                    <Button
                        type="submit"
                        isProcessing={isSubmitting}
                        disabled={isSubmitting || !isValid}
                    >
                        {isSubmitting
                            ? "Creating Account..."
                            : "Create Account"}
                    </Button>
                </form>
            </RecaptchaProvider>
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
