import { DateTime } from "luxon";
import { useMemo } from "react";
import { FullProduct, ProductStatus } from "../../types/Product";
import useForm from "../../hooks/useForm";
import { Alert, Button } from "flowbite-react";

const productStatuses = ["active", "inactive", "scheduled", "archived", "sold"];

export type UpdateProductFormState = {
    sku: string;
    name: string;
    slug: string;
    priceCost: number;
    priceInitial: number;
    priceRetail: number;
    initialQuantity: number;
    remainingQuantity: number;
    quality: number;
    auctionBatchCount: number;
    description: string;
    status: ProductStatus;
    scheduledFor: string;
};
export default function UpdateProductForm({
    onSubmit,
    product,
}: {
    onSubmit: (data: UpdateProductFormState) => Promise<void>;
    product: FullProduct;
}) {
    const initialState = useMemo(() => {
        const p = { ...product };
        if (!p.category) {
            p.category = null;
        }
        if (!p.tags) {
            p.tags = [];
        }
        if (!p.images) {
            p.images = [];
        }
        if (!p.status) {
            p.status = "inactive";
        }
        if (!p.quality) {
            p.quality = 1;
        }
        if (!p.auctionBatchCount) {
            p.auctionBatchCount = 1;
        }
        if (!p.scheduledFor) {
            p.scheduledFor = "";
        }

        return { ...p } as UpdateProductFormState;
    }, [product]);
    const validate = useMemo(() => {
        return {
            name: (v: string) => {
                const valid = v.trim().length > 3;
                return [
                    valid,
                    valid ? "" : "Product name must be at least 3 chars",
                ] as [boolean, string];
            },
            priceCost: (v: number): [boolean, string] => {
                const n = parseFloat(String(v));
                if (isNaN(n)) {
                    return [false, "Price cost must be a number"];
                }

                if (n < 1) {
                    return [false, "Price cost must be greater than 0"];
                }

                return [true, ""];
            },
            priceInitial: (v: number): [boolean, string] => {
                const n = parseFloat(String(v));
                if (isNaN(n)) {
                    return [false, "Initial price must be a number"];
                }

                if (n < 1) {
                    return [false, "Initial Price must be greater than 0"];
                }

                return [true, ""];
            },
            priceRetail: (v: number): [boolean, string] => {
                const n = parseFloat(String(v));
                if (isNaN(n)) {
                    return [false, "Retail Price must be a number"];
                }

                if (n < 1) {
                    return [false, "Retail Price must be greater than 0"];
                }

                return [true, ""];
            },
            initialQuantity: (v: number): [boolean, string] => {
                const n = parseFloat(String(v));
                if (isNaN(n)) {
                    return [false, "Initial quantity must be a number"];
                }

                if (n < 1) {
                    return [false, "Initial quantity must be greater than 0"];
                }

                return [true, ""];
            },
            remainingQuantity: (v: number): [boolean, string] => {
                const n = parseFloat(String(v));
                if (isNaN(n)) {
                    return [false, "Remaining quantity must be a number"];
                }

                if (n < 0) {
                    return [false, "Remaining quantity cannot be less than 0"];
                }

                return [true, ""];
            },
            quality: (v: number): [boolean, string] => {
                const n = parseFloat(String(v));
                if (isNaN(n)) {
                    return [false, "Quality must be a number"];
                }

                if (n < 0) {
                    return [false, "Quality cannot be less than 0"];
                }

                if (n > 5) {
                    return [false, "Quality cannot be greater than 5"];
                }

                return [true, ""];
            },
            auctionBatchCount: (v: number): [boolean, string] => {
                const n = parseFloat(String(v));
                if (isNaN(n)) {
                    return [false, "Auction batch be a number"];
                }

                if (n < 0) {
                    return [false, "Auction batch cannot be less than 0"];
                }

                if (n > 5) {
                    return [false, "Auction batch cannot be greater than 5"];
                }

                return [true, ""];
            },
            scheduledFor: (v: string): [boolean, string] => {
                if (!v) {
                    return [true, ""];
                }
                const d = DateTime.fromISO(v);

                if (!d.isValid) {
                    return [false, "Scheduled date must be valid"];
                }

                if (d < DateTime.now()) {
                    return [false, "Scheduled date must be in the future"];
                }

                return [true, ""];
            },
            status: (v: string): [boolean, string] => {
                const valid = productStatuses.includes(v);

                return [
                    valid,
                    valid ? "" : "Please select valid product status",
                ];
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
    } = useForm<UpdateProductFormState>({
        initialState,
        validate,
        onSubmit,
    });

    return (
        <form
            className="flex flex-col gap-4 bg-gray-100 p-6"
            onSubmit={handleSubmit}
        >
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
                    {isSubmitting ? "Updating..." : "Update"}
                </Button>
            </div>
        </form>
    );
}
