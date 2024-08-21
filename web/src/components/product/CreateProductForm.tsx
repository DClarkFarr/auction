import { useMemo } from "react";
import { FormModalFormProps } from "../../types/Modal";
import { isEqual } from "lodash-es";
import useForm from "../../hooks/useForm";
import { Alert, Button, Label, TextInput } from "flowbite-react";

export type CreateProductFormState = {
    name: string;
};

let initialStateCash: CreateProductFormState;

export default function CreateProductForm({
    onSubmit,
    initialState: initialStateRaw,
}: FormModalFormProps<CreateProductFormState>) {
    const initialState = useMemo(() => {
        return initialStateCash && isEqual(initialStateCash, initialStateRaw)
            ? initialStateCash
            : (initialStateCash = initialStateRaw || { name: "" });
    }, [initialStateRaw]);

    const validate = useMemo(() => {
        return {
            name: (v: string) => {
                const valid = v.trim().length > 3;
                return [
                    valid,
                    valid ? "" : "Product name must be at least 3 chars",
                ] as [boolean, string];
            },
        };
    }, []);

    const {
        isSubmitting,
        errorMessage,
        handleSubmit,
        isValid,
        fields: { name },
        attrs,
    } = useForm<CreateProductFormState>({
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
                    <Label htmlFor="name" value="Product Name" />
                </div>
                <TextInput
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Fake Stanley Cup, etc"
                    disabled={isSubmitting}
                    color={
                        !name.focus && name.dirty && !name.valid
                            ? "failure"
                            : undefined
                    }
                    required
                    value={name.value}
                    helperText={
                        !name.focus && name.dirty && !name.valid && name.error
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
                    {isSubmitting ? "Creating..." : "Create"}
                </Button>
            </div>
        </form>
    );
}
