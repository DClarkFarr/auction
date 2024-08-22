import { DateTime } from "luxon";
import { useMemo } from "react";
import { FullProduct, ProductStatus } from "../../types/Product";
import useForm from "../../hooks/useForm";
import { Alert, Button, Label, Select, TextInput } from "flowbite-react";
import QuickInput from "../controls/QuickInput";

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

        if (!p.priceCost) {
            p.priceCost = 1;
        }
        if (!p.priceInitial) {
            p.priceInitial = 0;
        }
        if (!p.priceRetail) {
            p.priceRetail = 0;
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
        fields: {
            sku,
            name,
            priceCost,
            priceInitial,
            priceRetail,
            initialQuantity,
            remainingQuantity,
            quality,
            auctionBatchCount,
            description,
            status,
            scheduledFor,
        },
        attrs,
        selectAttrs,
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
            <div className="lg:flex flex-col gap-4 lg:flex-row">
                <div className="lg:w-1/2">
                    <QuickInput
                        label="Product name"
                        name="name"
                        placeholder="Fake Stanley Cup (example)"
                        field={name}
                        attrs={attrs}
                        isSubmitting={isSubmitting}
                    />
                </div>
                <div className="lg:w-1/2">
                    <div className="mb-2 block">
                        <Label>URL slug</Label>
                    </div>
                    <TextInput value={product.slug} disabled />
                </div>
            </div>

            <div className="prices">
                <h3 className="text-lg pt-2 -mb-4">Prices</h3>
            </div>

            <div className="lg:flex flex-col gap-4 lg:flex-row">
                <div className="lg:w-1/3">
                    <QuickInput
                        name="priceCost"
                        field={priceCost}
                        attrs={attrs}
                        label="Store Cost"
                        type="number"
                        isSubmitting={isSubmitting}
                    />
                </div>
                <div className="lg:w-1/3">
                    <QuickInput
                        name="priceInitial"
                        field={priceInitial}
                        attrs={attrs}
                        label="Starting Bid Price"
                        type="number"
                        isSubmitting={isSubmitting}
                    />
                </div>
                <div className="lg:w-1/3">
                    <QuickInput
                        name="priceRetail"
                        field={priceRetail}
                        attrs={attrs}
                        label="Retail Compare Price"
                        type="number"
                        isSubmitting={isSubmitting}
                    />
                </div>
            </div>

            <div className="lg:flex flex-col gap-4 lg:flex-row">
                <div className="lg:w-1/3">
                    <QuickInput
                        name="auctionBatchCount"
                        field={auctionBatchCount}
                        attrs={attrs}
                        label="Auction batch count"
                        type="number"
                        tooltip="How many do you want to be open for bidding at the same time?"
                        isSubmitting={isSubmitting}
                    />
                </div>
                <div className="lg:w-1/3">
                    <QuickInput
                        name="initialQuantity"
                        field={initialQuantity}
                        attrs={attrs}
                        label="Initial quantity"
                        type="number"
                        tooltip="How many quantity did you initially obtain? The auction will continue in batches, until quantity remaining = 0"
                        isSubmitting={isSubmitting}
                    />
                </div>
                <div className="lg:w-1/3">
                    <QuickInput
                        name="remainingQuantity"
                        field={remainingQuantity}
                        attrs={attrs}
                        label="Remaining Quantity"
                        type="number"
                        tooltip="How many items are yet to be sold. Consider not updating this to avoid bugs."
                        isSubmitting={isSubmitting}
                    />
                </div>
            </div>

            <div className="lg:flex flex-col gap-4 lg:flex-row">
                <div className="lg:w-1/2">
                    <QuickInput
                        label="SKU"
                        name="sku"
                        field={sku}
                        attrs={attrs}
                        isSubmitting={isSubmitting}
                    />
                </div>
                <div className="lg:w-1/2">
                    <div className="mb-2">
                        <Label>Status</Label>
                    </div>
                    <Select id="status" name="status" {...selectAttrs}>
                        {productStatuses.map((s) => (
                            <option
                                value={s}
                                key={s}
                                selected={status.value === s}
                            >
                                {s.toLocaleUpperCase()}
                            </option>
                        ))}
                    </Select>
                </div>
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
                    {isSubmitting ? "Updating..." : "Update"}
                </Button>
            </div>
        </form>
    );
}
