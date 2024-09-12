import { Alert, Button, Label, Spinner, Textarea } from "flowbite-react";
import useSettingContext from "../../hooks/useSettingContext";
import { ScopedSetting } from "../../providers/ScopedSettingProvider";
import { FeaturedProduct } from "../../types/SiteSetting";
import { v4 as makeUuid } from "uuid";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import TimesIcon from "~icons/ic/baseline-close";
import useForm from "../../hooks/useForm";
import useProductsQuery from "../../hooks/admin/useProductsQuery";
import { Product, WithCategory, WithImages } from "../../types/Product";
import Select, { SelectInstance, SingleValue } from "react-select";
import QuickInput from "../controls/QuickInput";
import { uploadedAsset } from "../../utils/asset";
import { useMutateSetting } from "../../hooks/admin/useMutateSetting";
import Accordion from "../controls/Accordion";
import { ToggleSwitch } from "flowbite-react";
import ReorderList from "../controls/ReorderList";

type ProductForm = Omit<FeaturedProduct, "order">;

const defaultFeaturedProducts: FeaturedProduct[] = [];

const validate = {
    uuid: (v: string) => {
        const valid = !!v;

        return [valid, valid ? "" : "UUID is required"] satisfies [
            boolean,
            string
        ];
    },
    id_product: (id: number) => {
        return [!!id, id ? "" : "Please select product"] satisfies [
            boolean,
            string
        ];
    },
    name: (v: string) => {
        const valid = String(v).trim().length > 4;
        return [
            valid,
            valid ? "" : "Name must be at least 4 characters",
        ] satisfies [boolean, string];
    },
    description: (v: string) => {
        const valid = String(v).trim().length > 4;
        return [
            valid,
            valid ? "" : "Description must be at least 4 characters",
        ] satisfies [boolean, string];
    },
    image: (v: string) => {
        const valid = !!v;

        return [valid, valid ? "" : "Please select an image"] satisfies [
            boolean,
            string
        ];
    },
};

function validateFeaturedProduct(fp: ProductForm) {
    const keys = Object.keys(validate) as (keyof typeof validate)[];

    const isValid = keys
        .map((key) => {
            if (key === "id_product") {
                return validate[key](Number(fp[key]));
            }
            return validate[key](fp[key])[0];
        })
        .every(Boolean);

    return isValid;
}

function ManageFeaturedProducts() {
    const [reorder, setReorder] = useState(false);
    const { setting, isLoading, isSuccess, error } =
        useSettingContext<"featuredProducts">();

    const [featuredProducts, setFeaturedProducts] = useState(
        setting || defaultFeaturedProducts
    );

    useEffect(() => {
        setFeaturedProducts(setting || []);
    }, [setting]);

    const { saveSetting } = useMutateSetting("featuredProducts");

    const { pagination } = useProductsQuery(["active", "inactive"], 1, {
        limit: 500,
        withImages: true,
    });

    const products = (pagination?.rows || []) as WithCategory<
        WithImages<Product>
    >[];

    const handleSaveProduct = useCallback(
        async (fp: FeaturedProduct) => {
            const toSet = featuredProducts.map((p) =>
                p.uuid === fp.uuid ? { ...fp } : p
            );

            setFeaturedProducts(toSet);
            saveSetting(toSet);
        },
        [featuredProducts]
    );

    const handleRemoveProduct = useCallback(
        async (fp: FeaturedProduct) => {
            const toSet = featuredProducts.filter((p) => p.uuid !== fp.uuid);
            setFeaturedProducts(toSet);
            saveSetting(toSet);
        },
        [featuredProducts]
    );

    const onAddProduct = () => {
        const toAdd: FeaturedProduct = {
            uuid: makeUuid(),
            id_product: 0,
            name: "",
            description: "",
            image: "",
            order: featuredProducts.length,
        };

        setFeaturedProducts((prev) => [...prev, toAdd]);
    };

    const handleReorder = (fp: FeaturedProduct[]) => {
        setFeaturedProducts(fp);
        saveSetting(fp);
    };

    if (isLoading) {
        return (
            <div className="p-6">
                <Spinner />
            </div>
        );
    }

    if (!isSuccess && error) {
        return (
            <Alert color="failure">
                <div className="font-semibold">
                    Error loading featured Products
                </div>
                <div>{error.message}</div>
            </Alert>
        );
    }

    return (
        <div>
            <div className="flex w-full flex-col gap-4 mb-8">
                {!featuredProducts.length && (
                    <>
                        <Alert color="info">No Featured Products yet.</Alert>
                    </>
                )}
                {featuredProducts.length > 0 && (
                    <div className="flex justify-end">
                        <ToggleSwitch
                            checked={reorder}
                            label={reorder ? "Reorder on" : "reorder off"}
                            onChange={() => setReorder(!reorder)}
                        />
                    </div>
                )}
                {
                    <ReorderList
                        active={reorder}
                        getKey={(v) => v.uuid}
                        rows={featuredProducts}
                        onChange={handleReorder}
                    >
                        {featuredProducts.map((fp) => {
                            return (
                                <ProductRow
                                    products={products}
                                    featuredProduct={fp}
                                    key={fp.uuid}
                                    open={!reorder}
                                    onSave={handleSaveProduct}
                                    onRemove={handleRemoveProduct}
                                />
                            );
                        })}
                    </ReorderList>
                }
            </div>
            <div>
                <Button onClick={onAddProduct}>Add Product</Button>
            </div>
        </div>
    );
}

export default function SettingsFeaturedProducts() {
    return (
        <ScopedSetting setting="featuredProducts">
            <ManageFeaturedProducts />
        </ScopedSetting>
    );
}

function ProductRow({
    products,
    featuredProduct,
    open,
    onSave,
    onRemove,
}: {
    open?: boolean;
    products: WithCategory<WithImages<Product>>[];
    featuredProduct: FeaturedProduct;
    onSave: (featuredProduct: FeaturedProduct) => Promise<void>;
    onRemove: (featuredProduct: FeaturedProduct) => Promise<void>;
}) {
    const selectRef =
        useRef<SelectInstance<WithImages<WithCategory<Product>>>>(null);

    const initialState = useMemo(() => {
        const obj = Object.fromEntries(
            Object.entries(featuredProduct).filter(
                ([key]) => !["order"].includes(key)
            )
        );

        return obj as ProductForm;
    }, [featuredProduct]);

    const [selectedProduct, setSelectedProduct] = useState<WithImages<
        WithCategory<Product>
    > | null>(null);

    const onSubmit = async (data: ProductForm) => {
        if (!validateFeaturedProduct(data)) {
            console.warn("data was invalid");
            return;
        }
        await onSave({ ...data, order: featuredProduct.order });
    };

    const {
        isSubmitting,
        isValid,
        fields: { id_product, name, description, image },
        attrs,
        setField,
        handleSubmit,
    } = useForm({
        initialState,
        validate,
        onSubmit,
        resetOnSubmit: false,
    });

    const handleProductSelect = (
        e: SingleValue<WithImages<WithCategory<Product>>>
    ) => {
        const id = e?.id_product;
        const isSame = selectedProduct
            ? selectedProduct.id_product === id
            : id === featuredProduct.id_product;

        setSelectedProduct(e || null);
        setField("id_product", {
            value: id || "",
            dirty: true,
        });

        if (!e) {
            return;
        }

        if (!isSame) {
            setField("name", {
                value: e.name,
                dirty: true,
            });

            setField("description", {
                value: e.description,
                dirty: true,
            });
            const imagePath = e?.images?.[0]?.path || "";

            setField("image", {
                value: imagePath,
                dirty: !!imagePath,
            });
        }
    };

    const handleSelectImage = (path: string) => {
        setField("image", {
            value: path,
            dirty: true,
        });
    };

    const handleProductRemove = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => (onRemove(featuredProduct), e.preventDefault());

    useEffect(() => {
        if (
            products.length &&
            selectRef.current &&
            featuredProduct?.id_product &&
            !selectedProduct
        ) {
            const found = products.find(
                (p) => p.id_product === featuredProduct?.id_product
            );

            setSelectedProduct(found || null);
            selectRef.current.setValue(found || null, "select-option");
        }
    }, [featuredProduct, products]);

    return (
        <Accordion
            initialOpen={open}
            locked={!open}
            heading={
                <Accordion.Heading className="bg-gray-300 p-1">
                    <div className="product__header flex items-center gap-4 w-full">
                        <div>
                            <h2 className="text-xl">
                                Product #{featuredProduct.order + 1}
                            </h2>
                        </div>
                        <div className="ml-auto">
                            <Button
                                size="xs"
                                color="failure"
                                onClick={handleProductRemove}
                            >
                                <TimesIcon />
                            </Button>
                        </div>
                    </div>
                </Accordion.Heading>
            }
        >
            <div>
                <div className="product bg-slate-100 p-4">
                    <form
                        className="flex w-full flex-col gap-4"
                        onSubmit={handleSubmit}
                    >
                        <input
                            type="hidden"
                            name="uuid"
                            value={featuredProduct.uuid}
                        />
                        <div>
                            <Label>Select Product</Label>
                            <Select
                                ref={selectRef}
                                options={products}
                                getOptionLabel={(p) => p.name}
                                getOptionValue={(p) => String(p.id_product)}
                                defaultValue={products.find(
                                    (p) =>
                                        String(p.id_product) ===
                                        String(id_product.value)
                                )}
                                onChange={handleProductSelect}
                            />
                        </div>

                        {!!id_product.value && (
                            <>
                                <div>
                                    <QuickInput
                                        name="name"
                                        label="Featured Product Title"
                                        field={name}
                                        isSubmitting={isSubmitting}
                                        attrs={attrs}
                                    />
                                </div>

                                <div>
                                    <QuickInput
                                        as={Textarea}
                                        name="description"
                                        label="Description"
                                        field={description}
                                        isSubmitting={isSubmitting}
                                        attrs={attrs}
                                        rows={8}
                                    />
                                </div>

                                <div className="images-grid gap-4 grid grid-cols-4 auto-cols-max bg-gray-100 p-4 rounded">
                                    {selectedProduct?.images?.map((img) => {
                                        const isSelected =
                                            img.path === image.value;

                                        return (
                                            <div key={img.id_image}>
                                                <div
                                                    onClick={() =>
                                                        handleSelectImage(
                                                            img.path
                                                        )
                                                    }
                                                    className={`border-4 inline-flex cursor-pointer ${
                                                        isSelected
                                                            ? "border-purple-500"
                                                            : "border-gray-100"
                                                    }`}
                                                >
                                                    <img
                                                        className="w-[150px] object-cover aspect-video"
                                                        src={uploadedAsset(
                                                            img.path
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}

                        <div>
                            <Button
                                type="submit"
                                color="blue"
                                disabled={!isValid || isSubmitting}
                                isProcessing={isSubmitting}
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Accordion>
    );
}
