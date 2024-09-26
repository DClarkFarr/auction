import { Button, Label, TextInput, Alert } from "flowbite-react";
import { ReactNode, useMemo } from "react";
import { validateEmail } from "../../utils/validate";
import useForm from "../../hooks/useForm";

type ForgotPasswordFormState = {
    email: string;
};

export type ForgotPasswordFormProps = {
    footer?: ReactNode;
    onSubmit: (data: ForgotPasswordFormState) => Promise<void>;
};

const initialState = {
    email: "",
};

export default function ForgotPasswordForm({
    onSubmit,
    footer,
}: ForgotPasswordFormProps) {
    const validate = useMemo(() => {
        return {
            email: (v: string) => {
                const valid = validateEmail(String(v));

                return [valid, valid ? "" : "Email is not valid"] as [
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
        fields: { email },
        attrs,
    } = useForm<ForgotPasswordFormState>({
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
                    {isSubmitting ? "Requesting..." : "Request Reset Code"}
                </Button>
            </form>
            {footer && <div className="mt-4">{footer}</div>}
        </div>
    );
}
