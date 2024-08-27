import { Label, Spinner } from "flowbite-react";
import { SelectInstance, SingleValue } from "react-select";
import CreatableSelect from "react-select/creatable";
import useCategoriesQuery from "../../hooks/useCategoriesQuery";
import { useEffect, useMemo, useRef } from "react";
import { Category } from "../../types/Product";

export default function ManageCategory({
    onSelectCategory,
    onCreateCategory,
    category,
}: {
    category: Category | null;
    onSelectCategory: (idCategory: number) => Promise<void>;
    onCreateCategory: (categoryLabel: string) => Promise<void>;
}) {
    const { categories, isLoading } = useCategoriesQuery();

    const ref = useRef<SelectInstance>(null);

    const options = useMemo(() => {
        return categories.map((c) => ({
            label: c.label,
            value: c.id_category,
        }));
    }, [categories]);

    const defaultValue = useMemo(() => {
        if (!category) {
            return undefined;
        }
        return {
            value: category.id_category,
            label: category.label,
        };
    }, [category]);

    const handleChange = (
        newValue: SingleValue<{ value: number; label: string }>
    ) => {
        if (isLoading) {
            return;
        }
        if (newValue && newValue.value !== category?.id_category) {
            onSelectCategory(newValue.value);
        }
    };

    const handleCreateCategory = (label: string) => {
        if (isLoading) {
            return;
        }
        onCreateCategory(label);
    };

    useEffect(() => {
        if (defaultValue && ref.current) {
            ref.current.setValue(defaultValue, "select-option");
        }
    }, [defaultValue]);

    return (
        <div className="category-select">
            <Label>Assign Category</Label>
            {isLoading && (
                <div className="p-4">
                    <Spinner size="lg" />
                </div>
            )}
            {!isLoading && (
                <CreatableSelect
                    ref={ref}
                    defaultValue={defaultValue}
                    options={options}
                    isClearable={false}
                    isMulti={false}
                    isSearchable
                    onChange={(val) =>
                        handleChange(
                            val as SingleValue<{ label: string; value: number }>
                        )
                    }
                    placeholder="Find or create category"
                    onCreateOption={handleCreateCategory}
                />
            )}
        </div>
    );
}
