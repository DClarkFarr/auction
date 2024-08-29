import { Alert, Button, Label, Spinner, Textarea } from "flowbite-react";
import useSettingContext from "../../hooks/useSettingContext";
import { ScopedSetting } from "../../providers/ScopedSettingProvider";
import { FeaturedProduct } from "../../types/SiteSetting";
import { v4 as makeUuid } from "uuid";
import { useMemo, useState } from "react";
import TimesIcon from "~icons/ic/baseline-close";
import useForm from "../../hooks/useForm";
import useProductsQuery from "../../hooks/admin/useProductsQuery";
import { Product, WithCategory, WithImages } from "../../types/Product";
import Select, { SingleValue } from "react-select";
import QuickInput from "../controls/QuickInput";
import { uploadedAsset } from "../../utils/asset";

export default function SettingsFeaturedProducts() {
    return (
        <ScopedSetting setting="featuredProducts">
            <ManageFeaturedProducts />
        </ScopedSetting>
    );
}

const defaultFeaturedProducts: FeaturedProduct[] = [];

function ManageFeaturedProducts() {
    const { setting, isLoading, isSuccess, error } =
        useSettingContext<"featuredProducts">();

    const [featuredProducts, setFeaturedProducts] = useState(
        setting || defaultFeaturedProducts
    );

    const { pagination } = useProductsQuery(["active", "inactive"], 1, {
        limit: 500,
        withImages: true,
    });

    const products = (pagination?.rows || []) as WithCategory<
        WithImages<Product>
    >[];

    const handleSaveProduct = async (fp: FeaturedProduct) => {
        setFeaturedProducts((prev) =>
            prev.map((p) => (p.uuid === fp.uuid ? { ...fp } : p))
        );
    };

    const handleRemoveProduct = async (fp: FeaturedProduct) => {
        setFeaturedProducts((prev) => prev.filter((p) => p.uuid !== fp.uuid));
    };

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
                {featuredProducts.map((p) => (
                    <ProductRow
                        products={products}
                        product={p}
                        key={p.uuid}
                        onSave={handleSaveProduct}
                        onRemove={handleRemoveProduct}
                    />
                ))}
            </div>
            <div>
                <Button onClick={onAddProduct}>Add Product</Button>
            </div>
        </div>
    );
}

type ProductForm = Omit<FeaturedProduct, "order">;

function ProductRow({
    products,
    product,
    onSave,
    onRemove,
}: {
    products: WithCategory<WithImages<Product>>[];
    product: FeaturedProduct;
    onSave: (product: FeaturedProduct) => Promise<void>;
    onRemove: (product: FeaturedProduct) => Promise<void>;
}) {
    const initialState = useMemo(() => {
        const obj = Object.fromEntries(
            Object.entries(product).filter(([key]) => !["order"].includes(key))
        );

        return obj as ProductForm;
    }, []);

    const [selectedProduct, setSelectedProduct] =
        useState<WithImages<Product> | null>(null);

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

    const onSubmit = async (data: ProductForm) => {
        onSave({ ...data, order: product.order });
    };

    const {
        isSubmitting,
        isValid,
        fields: { id_product, name, description, image },
        attrs,
        setField,
    } = useForm({
        initialState,
        validate,
        onSubmit,
    });

    const handleProductSelect = (
        e: SingleValue<WithImages<WithCategory<Product>>>
    ) => {
        setSelectedProduct(e || null);
        const id = e?.id_product;
        setField("id_product", {
            value: id || "",
            dirty: true,
        });

        if (!e) {
            return;
        }

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
    };

    const handleSelectImage = (path: string) => {
        setField("image", {
            value: path,
            dirty: true,
        });
    };

    return (
        <div>
            <div className="product bg-slate-100 p-4">
                <div className="product__header flex items-center gap-4">
                    <div>
                        <h2 className="text-xl">
                            Product #{product.order + 1}
                        </h2>
                    </div>
                    <div className="ml-auto">
                        <Button
                            color="failure"
                            onClick={() => onRemove(product)}
                        >
                            <TimesIcon />
                        </Button>
                    </div>
                </div>
                <form className="flex w-full flex-col gap-4">
                    <input type="hidden" name="uuid" value={product.uuid} />
                    <div>
                        <Label>Select Product</Label>
                        <Select
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
                                    as={(props) => (
                                        <Textarea rows={8} {...props} />
                                    )}
                                    name="description"
                                    label="Description"
                                    field={description}
                                    isSubmitting={isSubmitting}
                                    attrs={attrs}
                                />
                            </div>

                            <div className="images-grid gap-4 grid grid-cols-4 auto-cols-max bg-gray-100 p-4 rounded">
                                {selectedProduct?.images?.map((img) => {
                                    const isSelected = img.path === image.value;
                                    return (
                                        <div key={img.id_image}>
                                            <div
                                                onClick={() =>
                                                    handleSelectImage(img.path)
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
    );
}
