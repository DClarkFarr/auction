import { useMemo } from "react";
import { FormModalFormProps } from "../../types/Modal";
import { isEqual } from "lodash-es";
import useForm from "../../hooks/useForm";
import { Alert, Button, Label, TextInput } from "flowbite-react";

export type UpdateCategoryFormState = {
    label: string;
};

let initialStateCash: UpdateCategoryFormState;

export default function UpdateCategoryForm({
    onSubmit,
    initialState: initialStateRaw,
}: FormModalFormProps<UpdateCategoryFormState>) {
    const initialState = useMemo(() => {
        return initialStateCash && isEqual(initialStateCash, initialStateRaw)
            ? initialStateCash
            : (initialStateCash = initialStateRaw || { label: "" });
    }, [initialStateRaw]);

    const validate = useMemo(() => {
        return {
            label: (v: string) => {
                const valid = v.trim().length > 3;
                return [
                    valid,
                    valid ? "" : "Label must be at least 3 chars",
                ] as [boolean, string];
            },
        };
    }, []);

    const {
        isSubmitting,
        errorMessage,
        handleSubmit,
        isValid,
        fields: { label },
        attrs,
    } = useForm<UpdateCategoryFormState>({
        initialState,
        validate,
        onSubmit,
    });

    return (
        <form
            className="flex flex-col gap-4 bg-gray-100 p-6"
            onSubmit={handleSubmit}
        >
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="label" value="Category Name" />
                </div>
                <TextInput
                    id="label"
                    name="label"
                    type="text"
                    placeholder="Clothes, shoes, etc"
                    disabled={isSubmitting}
                    color={
                        !label.focus && label.dirty && !label.valid
                            ? "failure"
                            : undefined
                    }
                    required
                    value={label.value}
                    helperText={
                        !label.focus &&
                        label.dirty &&
                        !label.valid &&
                        label.error
                    }
                    {...attrs}
                />
            </div>
            {errorMessage && (
                <Alert color="failure" className="mb-4">
                    {" "}
                    {errorMessage}
                </Alert>
            )}
            <div>
                <Button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    isProcessing={isSubmitting}
                >
                    {isSubmitting ? "Saving..." : "Save"}
                </Button>
            </div>
        </form>
    );
}
