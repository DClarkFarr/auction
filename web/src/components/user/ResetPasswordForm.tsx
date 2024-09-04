import { Button, Label, TextInput, Alert } from "flowbite-react";
import { validatePassword } from "../../utils/validate";
import SpinIcon from "~icons/ic/baseline-refresh";
import useForm from "../../hooks/useForm";
import React from "react";
import SlideUpDown from "../transition/SlideUpDown";
import { cls } from "../../utils/attributes";
import CheckIcon from "~icons/ic/baseline-check-circle-outline";
import TimesIcon from "~icons/ic/outline-cancel";

export type ResetPasswordState = {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
};

export type ResetPasswordProps = {
    onSubmit: (data: ResetPasswordState) => Promise<void>;
};

const initialState = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
};

export default function ResetPasswordForm({ onSubmit }: ResetPasswordProps) {
    const validate = React.useMemo(() => {
        return {
            oldPassword: (v: string) => {
                const valid = (v || "").trim().length > 3;

                return [
                    valid,
                    valid ? "" : "Please include your current password",
                ] as [boolean, string];
            },
            newPassword: (v: string) => {
                const allValid = Object.values(
                    validatePassword(String(v))
                ).every(Boolean);

                return [allValid, allValid ? "" : "Password is not valid"] as [
                    boolean,
                    string
                ];
            },
            confirmPassword: (v: string, s: ResetPasswordState) => {
                const valid = v === s.newPassword;

                return [valid, valid ? "" : "New passwords do not match"] as [
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
        fields: { oldPassword, newPassword, confirmPassword },
        attrs,
    } = useForm<ResetPasswordState>({
        initialState,
        validate,
        onSubmit,
    });

    const passwordCriteria = React.useMemo(() => {
        return validatePassword(newPassword.value);
    }, [newPassword.value]);

    return (
        <div className="max-w-full w-[450px]">
            <form
                className="flex flex-col gap-4 bg-gray-100 p-6"
                onSubmit={handleSubmit}
            >
                <div>
                    <div className="mb-2 block">
                        <Label
                            htmlFor="oldPassword"
                            value="Your current password"
                        />
                    </div>
                    <TextInput
                        id="oldPassword"
                        name="oldPassword"
                        type="password"
                        required
                        value={oldPassword.value}
                        color={
                            !oldPassword.focus &&
                            oldPassword.dirty &&
                            !oldPassword.valid
                                ? "failure"
                                : undefined
                        }
                        helperText={
                            !oldPassword.focus &&
                            oldPassword.dirty &&
                            !oldPassword.valid &&
                            oldPassword.error
                        }
                        {...attrs}
                    />
                </div>

                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="newPassword" value="New password" />
                    </div>
                    <TextInput
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        required
                        value={newPassword.value}
                        color={
                            !newPassword.focus &&
                            newPassword.dirty &&
                            !newPassword.valid
                                ? "failure"
                                : undefined
                        }
                        helperText={
                            !newPassword.focus &&
                            newPassword.dirty &&
                            !newPassword.valid &&
                            newPassword.error
                        }
                        {...attrs}
                    />
                    <SlideUpDown show={newPassword.focus || newPassword.valid}>
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
                            htmlFor="confirmPassword"
                            value="Confirm password"
                        />
                    </div>
                    <TextInput
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        value={confirmPassword.value}
                        color={
                            confirmPassword.dirty && !confirmPassword.valid
                                ? "failure"
                                : undefined
                        }
                        helperText={
                            confirmPassword.dirty &&
                            !confirmPassword.valid &&
                            confirmPassword.error
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
                            Resetting...
                        </div>
                    ) : (
                        "Reset Password"
                    )}
                </Button>
            </form>
        </div>
    );
}

const PasswordLine = ({
    valid,
    children,
}: {
    valid: boolean;
    children: React.ReactNode;
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
