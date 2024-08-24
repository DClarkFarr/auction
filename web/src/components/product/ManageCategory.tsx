import { Label, Spinner } from "flowbite-react";
import { SingleValue } from "react-select";
import CreatableSelect from "react-select/creatable";
import useCategoriesQuery from "../../hooks/useCategoriesQuery";
import { useMemo } from "react";

export default function ManageCategory({
    onSelectCategory,
    onCreateCategory,
}: {
    onSelectCategory: (idCategory: number) => Promise<void>;
    onCreateCategory: (categoryLabel: string) => Promise<void>;
}) {
    const { categories, isLoading } = useCategoriesQuery();

    const options = useMemo(() => {
        return categories.map((c) => ({
            label: c.label,
            value: c.id_category,
        }));
    }, [categories]);

    const handleChange = (
        newValue: SingleValue<{ value: number; label: string }>
    ) => {
        if (newValue) {
            onSelectCategory(newValue.value);
        }
    };

    const handleCreateCategory = (label: string) => {
        onCreateCategory(label);
    };

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
                    options={options}
                    isClearable={false}
                    isMulti={false}
                    isSearchable
                    onChange={handleChange}
                    placeholder="Find or create category"
                    onCreateOption={handleCreateCategory}
                />
            )}
        </div>
    );
}
