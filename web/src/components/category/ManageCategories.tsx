import { useFormModal } from "../../hooks/useModalForm";
import FormModal from "../modal/FormModal";

import EditIcon from "~icons/ic/round-mode-edit-outline";
import UpdateCategoryForm, {
    UpdateCategoryFormState,
} from "./UpdateCategoryForm";
import { useUpdateCategory } from "../../hooks/admin/useCategoryQuery";
import { useState } from "react";
import { FullCategory } from "../../types/Product";
import CategoryList from "./CategoryList";
import { Button } from "flowbite-react";

export default function ManageCategories() {
    const { update } = useUpdateCategory();
    const [selectedCategory, setSelectedCategory] =
        useState<FullCategory | null>(null);

    const formModal = useFormModal<UpdateCategoryFormState>({
        heading: "Update Product",
        size: "md",
        onAccept: async (data) => {
            if (selectedCategory) {
                const c = await update(selectedCategory.id_category, data);
                console.log("updated res", c);
            }
        },
    });

    const onShowUpdateModal = async (category: FullCategory) => {
        setSelectedCategory(category);

        formModal.setOpenModal(true);
    };

    return (
        <div>
            <div className="md:flex flex-col md:flex-row">
                <div>
                    <h1 className="mb-8 text-2xl">Categories </h1>
                </div>
            </div>

            <FormModal {...formModal} form={UpdateCategoryForm} />

            <CategoryList
                actions={({ category }) => (
                    <div>
                        <Button
                            onClick={() => onShowUpdateModal(category)}
                            size="xs"
                        >
                            <EditIcon />
                        </Button>
                    </div>
                )}
            />
        </div>
    );
}
