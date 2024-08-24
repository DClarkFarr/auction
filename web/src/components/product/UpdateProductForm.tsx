import { DateTime } from "luxon";
import { useMemo } from "react";
import {
    Product,
    FullProduct,
    ProductQuality,
    ProductStatus,
    ProductDetailItem,
} from "../../types/Product";
import useForm from "../../hooks/useForm";
import {
    Alert,
    Button,
    Label,
    Popover,
    Select,
    Textarea,
    TextInput,
} from "flowbite-react";
import QuickInput from "../controls/QuickInput";
import Stars from "../controls/Stars";
import QuestionIcon from "~icons/ic/baseline-contact-support";
import ManageDetailItems from "./ManageDetailItems";
import ManageCategory from "./ManageCategory";

const productStatuses = ["active", "inactive", "scheduled", "archived", "sold"];

export type UpdateProductFormState = {
    sku: string;
    name: string;
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

const productFieldDefaults: Record<
    keyof UpdateProductFormState,
    string | number
> = {
    name: "",
    status: "inactive",
    quality: 1,
    auctionBatchCount: 1,
    scheduledFor: "",
    priceCost: 1,
    priceInitial: 0,
    priceRetail: 0,
    sku: "",
    description: "",
    initialQuantity: 1,
    remainingQuantity: 1,
};

export default function UpdateProductForm({
    onSubmit,
    onSaveDetailItems,
    onSaveCategory,
    onCreateProductCategory,
    product,
}: {
    onSubmit: (data: UpdateProductFormState) => Promise<void>;
    onSaveDetailItems: (items: ProductDetailItem[]) => Promise<void>;
    onSaveCategory: (idCategory: number) => Promise<void>;
    onCreateProductCategory: (
        idProduct: number,
        categoryLabel: string
    ) => Promise<void>;
    product: FullProduct;
}) {
    const initialState = useMemo(() => {
        const p = Object.entries(product).reduce((acc, [key, val]) => {
            if (
                !Object.prototype.hasOwnProperty.call(productFieldDefaults, key)
            ) {
                return acc;
            }

            if (key === "scheduledFor" && val) {
                return {
                    ...acc,
                    [key]: DateTime.fromISO(val as string).toFormat(
                        "yyyy-MM-dd'T'HH:mm"
                    ),
                };
            }

            return {
                ...acc,
                [key]:
                    val ||
                    productFieldDefaults[key as keyof UpdateProductFormState],
            };
        }, {} as Product);

        return p as UpdateProductFormState;
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
                if (String(v).length && isNaN(n)) {
                    return [false, "Remaining quantity must be a number"];
                }

                if (!isNaN(n) && n < 0) {
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

    const onCustomSubmit = async (
        data: UpdateProductFormState
    ): Promise<void> => {
        const intKeys = Object.entries(productFieldDefaults).reduce(
            (acc, [key, value]) => {
                if (typeof value === "number") {
                    acc.push(key);
                }
                return acc;
            },
            [] as string[]
        );

        const parsed = Object.entries(data).reduce((acc, [key, val]) => {
            if (intKeys.includes(key)) {
                if (key === "remainingQuantity" && val === "") {
                    return acc;
                }
                return { ...acc, [key]: Number(val) };
            }

            if (key === "scheduledFor" && val) {
                return { ...acc, [key]: new Date(val).toISOString() };
            }

            return { ...acc, [key]: val };
        }, {} as UpdateProductFormState);

        await onSubmit(parsed);
    };

    const {
        isSubmitting,
        errorMessage,
        handleSubmit,
        isValid,
        setField,
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
        onSubmit: onCustomSubmit,
    });

    const onCreateCategory = async (categoryLabel: string) => {
        await onCreateProductCategory(product.id_product, categoryLabel);
    };

    return (
        <div>
            <form
                className="flex flex-col gap-4 bg-gray-100 p-6 mb-6"
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

                <div className="prices">
                    <h3 className="text-lg pt-2 -mb-4">Quantities</h3>
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

                <div className="prices">
                    <h3 className="text-lg pt-2 -mb-4">Product information</h3>
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
                        <Select
                            id="status"
                            name="status"
                            {...selectAttrs}
                            defaultValue={status.value}
                        >
                            {productStatuses.map((s) => (
                                <option value={s} key={s}>
                                    {s.toLocaleUpperCase()}
                                </option>
                            ))}
                        </Select>
                    </div>
                </div>

                <div className="lg:flex flex-col gap-4 lg:flex-row">
                    <div className="lg:w-1/2">
                        <Label className="mb-2">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            rows={6}
                            value={description.value}
                            placeholder="Describe product here..."
                            disabled={isSubmitting}
                            color={
                                !description.focus &&
                                description.dirty &&
                                !description.valid
                                    ? "failure"
                                    : undefined
                            }
                            helperText={
                                !description.focus &&
                                description.dirty &&
                                !description.valid &&
                                description.error
                            }
                            {...attrs}
                        />
                    </div>
                    <div className="lg:w-1/2">
                        <div className="flex flex-col gap-4">
                            <div>
                                <Label className="mb-2" htmlFor="quality">
                                    Quality
                                </Label>

                                <div id="quality">
                                    <Stars
                                        value={quality.value as ProductQuality}
                                        onClick={(value) =>
                                            setField("quality", { value })
                                        }
                                    />
                                </div>
                            </div>
                            <div>
                                <Label className="flex gap-x-2 items-center mb-2">
                                    <div>Scheduled for:</div>
                                    <Popover
                                        placement="top"
                                        trigger="hover"
                                        theme={{
                                            arrow: {
                                                base: "absolute h-2 w-2 z-0 rotate-45 bg-gray-600 border border-gray-800 bg-gray-800",
                                            },
                                        }}
                                        content={
                                            <div className="p-4 max-w-[250px] text-center bg-gray-800 text-white text-xs">
                                                Take a product live by changing
                                                status to "active". Or leave it
                                                inactive, and schedule it to go
                                                live here.
                                            </div>
                                        }
                                    >
                                        <div>
                                            <QuestionIcon className="text-gray-500" />
                                        </div>
                                    </Popover>
                                </Label>
                                <TextInput
                                    id="scheduledFor"
                                    name="scheduledFor"
                                    type="datetime-local"
                                    disabled={isSubmitting}
                                    color={
                                        !scheduledFor.focus &&
                                        scheduledFor.dirty &&
                                        !scheduledFor.valid
                                            ? "failure"
                                            : undefined
                                    }
                                    required
                                    value={scheduledFor.value}
                                    helperText={
                                        !scheduledFor.focus &&
                                        scheduledFor.dirty &&
                                        !scheduledFor.valid &&
                                        scheduledFor.error
                                    }
                                    {...attrs}
                                />
                                <div className="flex justify-end">
                                    <div>
                                        <div
                                            className="text-sky-600 cursor-pointer hover:underline text-xs"
                                            onClick={() =>
                                                setField("scheduledFor", {
                                                    value: "",
                                                })
                                            }
                                        >
                                            Clear
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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

            <div className="bg-gray-100 mb-6 p-6">
                <h2 className="text-xl">Detail Items</h2>
                <ManageDetailItems
                    onChange={onSaveDetailItems}
                    detailItems={product.detailItems}
                />
            </div>

            <div className="bg-gray-100 mb-6 p-6">
                <h2 className="text-xl">Category</h2>
                <ManageCategory
                    onSelectCategory={onSaveCategory}
                    onCreateCategory={onCreateCategory}
                />
            </div>
        </div>
    );
}
