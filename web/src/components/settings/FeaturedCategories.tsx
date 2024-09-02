import {
    Alert,
    Button,
    Label,
    Spinner,
    Textarea,
    ToggleSwitch,
} from "flowbite-react";
import useSettingContext from "../../hooks/useSettingContext";
import { ScopedSetting } from "../../providers/ScopedSettingProvider";
import { FeaturedCategory } from "../../types/SiteSetting";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutateSetting } from "../../hooks/admin/useMutateSetting";
import useCategoriesQuery from "../../hooks/useCategoriesQuery";
import ReorderList from "../controls/ReorderList";
import { v4 as makeUuid } from "uuid";
import { Category, WithImage } from "../../types/Product";
import Select, { SelectInstance, SingleValue } from "react-select";
import useForm from "../../hooks/useForm";
import Accordion from "../controls/Accordion";
import TimesIcon from "~icons/ic/baseline-close";
import QuickInput from "../controls/QuickInput";
import { uploadedAsset } from "../../utils/asset";

export default function SettingsFeaturedCategories() {
    return (
        <ScopedSetting setting="featuredCategories">
            <ManageFeaturedCategories />
        </ScopedSetting>
    );
}

type CategoryForm = Omit<FeaturedCategory, "order">;

const defaultFeaturedCategories: FeaturedCategory[] = [];

const validate = {
    uuid: (v: string) => {
        const valid = !!v;

        return [valid, valid ? "" : "UUID is required"] satisfies [
            boolean,
            string
        ];
    },
    id_category: (id: number) => {
        return [!!id, id ? "" : "Please select category"] satisfies [
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
};

function validateFeaturedCategory(fp: CategoryForm) {
    const keys = Object.keys(validate) as (keyof typeof validate)[];

    const isValid = keys
        .map((key) => {
            if (key === "id_category") {
                return validate[key](Number(fp[key]));
            }
            return validate[key](fp[key])[0];
        })
        .every(Boolean);

    return isValid;
}

const defaultCategory: FeaturedCategory = {
    id_category: 0,
    uuid: makeUuid(),
    name: "",
    description: "",
    image: "",
    order: 0,
};
function ManageFeaturedCategories() {
    const [reorder, setReorder] = useState(false);
    const { setting, isLoading, isSuccess, error } =
        useSettingContext<"featuredCategories">();
    const [isAddingCategory, setIsAddingCategory] = useState(false);

    const featuredCategories = setting || defaultFeaturedCategories;

    const { saveSetting } = useMutateSetting("featuredCategories");

    const { categories } = useCategoriesQuery(true);

    const handleSaveCategory = useCallback(
        async (fc: FeaturedCategory) => {
            const found = featuredCategories.find((c) => c.uuid === fc.uuid);

            if (found) {
                await saveSetting(
                    featuredCategories.map((c) => (c.uuid === fc.uuid ? fc : c))
                );
            } else {
                setIsAddingCategory(false);
                await saveSetting([...featuredCategories, fc]);
            }
        },
        [featuredCategories]
    );

    const handleRemoveCategory = useCallback(
        async (fc: FeaturedCategory) => {
            await saveSetting(
                featuredCategories.filter((c) => c.uuid !== fc.uuid)
            );
        },
        [featuredCategories]
    );

    const handleReorder = useCallback((fps: FeaturedCategory[]) => {
        saveSetting(fps);
    }, []);

    const onAddCategory = () => {
        defaultCategory.uuid = makeUuid();
        defaultCategory.order =
            Math.max(...featuredCategories.map((c) => c.order), 0) + 1;
        setIsAddingCategory(true);
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
                    Error loading featured Categories
                </div>
                <div>{error.message}</div>
            </Alert>
        );
    }

    return (
        <div>
            <div className="flex w-full flex-col gap-4 mb-8">
                {!featuredCategories.length && !isAddingCategory && (
                    <>
                        <Alert color="info">No Featured Categories yet.</Alert>
                    </>
                )}
                {featuredCategories.length > 0 && (
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
                        active={reorder && !isAddingCategory}
                        getKey={(v) => v.uuid}
                        rows={featuredCategories}
                        onChange={handleReorder}
                    >
                        {featuredCategories.map((fp) => {
                            return (
                                <CategoryRow
                                    categories={categories}
                                    featuredCategory={fp}
                                    key={fp.uuid}
                                    open={!reorder}
                                    onSave={handleSaveCategory}
                                    onRemove={handleRemoveCategory}
                                />
                            );
                        })}
                    </ReorderList>
                }
                {isAddingCategory && (
                    <>
                        <CategoryRow
                            categories={categories}
                            featuredCategory={defaultCategory}
                            open={true}
                            onSave={handleSaveCategory}
                            onRemove={async () => setIsAddingCategory(false)}
                        />
                    </>
                )}
            </div>
            {!reorder && !isAddingCategory && (
                <>
                    <div>
                        <Button onClick={onAddCategory}>Add Category</Button>
                    </div>
                </>
            )}
        </div>
    );
}

function CategoryRow({
    categories,
    featuredCategory,
    open,
    onSave,
    onRemove,
}: {
    open?: boolean;
    categories: WithImage<Category>[];
    featuredCategory: FeaturedCategory;
    onSave: (featuredCategory: FeaturedCategory) => Promise<void>;
    onRemove: (featuredCategory: FeaturedCategory) => Promise<void>;
}) {
    const selectRef = useRef<SelectInstance<WithImage<Category>>>(null);

    const initialState = useMemo(() => {
        const obj = Object.fromEntries(
            Object.entries(featuredCategory).filter(
                ([key]) => !["order"].includes(key)
            )
        );

        return obj as CategoryForm;
    }, [featuredCategory]);

    const [selectedCategory, setSelectedCategory] =
        useState<WithImage<Category> | null>(null);

    const onSubmit = async (data: CategoryForm) => {
        if (!validateFeaturedCategory(data)) {
            console.warn("data was invalid");
            return;
        }
        await onSave({ ...data, order: featuredCategory.order });
    };

    const {
        isSubmitting,
        isValid,
        fields: { id_category, name, description },
        attrs,
        setField,
        handleSubmit,
    } = useForm({
        initialState,
        validate,
        onSubmit,
        resetOnSubmit: false,
    });

    const handleCategorySelect = (e: SingleValue<WithImage<Category>>) => {
        const id = e?.id_category;
        const isSame = selectedCategory
            ? selectedCategory.id_category === id
            : id === featuredCategory.id_category;

        setSelectedCategory(e || null);
        setField("id_category", {
            value: id || "",
            dirty: true,
        });

        if (!e) {
            return;
        }

        if (!isSame) {
            setField("name", {
                value: e.label,
                dirty: true,
            });

            setField("description", {
                value: "",
                dirty: true,
            });
            const imagePath = e?.image?.path || "";

            setField("image", {
                value: imagePath,
                dirty: !!imagePath,
            });
        }
    };

    const handleCategoryRemove = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => (onRemove(featuredCategory), e.preventDefault());

    useEffect(() => {
        if (
            categories.length &&
            selectRef.current &&
            featuredCategory?.id_category &&
            !selectedCategory
        ) {
            const found = categories.find(
                (p) => p.id_category === featuredCategory?.id_category
            );

            setSelectedCategory(found || null);
            selectRef.current.setValue(found || null, "select-option");
        }
    }, [featuredCategory, categories]);

    return (
        <Accordion
            initialOpen={open}
            locked={!open}
            heading={
                <Accordion.Heading className="bg-gray-300 p-1">
                    <div className="category__header flex items-center gap-4 w-full">
                        <div>
                            <h2 className="text-xl">
                                Category #{featuredCategory.order + 1}
                            </h2>
                        </div>
                        <div className="ml-auto">
                            <Button
                                size="xs"
                                color="failure"
                                onClick={handleCategoryRemove}
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
                            value={featuredCategory.uuid}
                        />
                        <div>
                            <Label>Select Product</Label>
                            <Select
                                ref={selectRef}
                                options={categories}
                                getOptionLabel={(c) => c.label}
                                getOptionValue={(c) => String(c.id_category)}
                                defaultValue={categories.find(
                                    (c) =>
                                        String(c.id_category) ===
                                        String(id_category.value)
                                )}
                                onChange={handleCategorySelect}
                            />
                        </div>

                        {!!id_category.value && (
                            <>
                                <div>
                                    <QuickInput
                                        name="name"
                                        label="Featured Category Title"
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
                                    {selectedCategory && (
                                        <>
                                            <div>
                                                <img
                                                    className="w-[150px] object-cover aspect-video"
                                                    src={
                                                        selectedCategory.image
                                                            ?.path
                                                            ? uploadedAsset(
                                                                  selectedCategory
                                                                      .image
                                                                      ?.path
                                                              )
                                                            : "https://placehold.co/200x120"
                                                    }
                                                />
                                            </div>
                                        </>
                                    )}
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
