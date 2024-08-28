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
import ManageCategoryImage from "./ManageCategoryImage";
import AdminService from "../../services/AdminService";

export default function ManageCategories() {
    const { update, refresh } = useUpdateCategory();
    const [selectedCategory, setSelectedCategory] =
        useState<FullCategory | null>(null);

    const [initialState, setInitialState] = useState<UpdateCategoryFormState>({
        label: "",
    });

    const formModal = useFormModal<UpdateCategoryFormState>({
        heading: "Update Product",
        size: "md",
        initialState,
        onAccept: async (data) => {
            if (selectedCategory) {
                const c = await update(selectedCategory.id_category, data);
                setSelectedCategory(c);
                setInitialState({ label: c.label });
                formModal.setOpenModal(false);
            }
        },
    });

    const onShowUpdateModal = async (category: FullCategory) => {
        setSelectedCategory(category);
        setInitialState({ label: category.label });
        formModal.setOpenModal(true);
    };

    const onUpdateCategoryImages = async (idCategory: number, file: File) => {
        const updated = await AdminService.uploadCategoryImage(
            idCategory,
            file
        );
        refresh(updated);
        setSelectedCategory(updated);
    };

    const onDeleteCategoryImage = async (category: FullCategory) => {
        const updated = await AdminService.deleteCategoryImage(
            category.id_category
        );
        refresh(updated);
        setSelectedCategory(updated);
    };

    return (
        <div>
            <div className="md:flex flex-col md:flex-row">
                <div>
                    <h1 className="mb-8 text-2xl">Categories </h1>
                </div>
            </div>

            <FormModal
                {...formModal}
                form={(props) => (
                    <div className="flex w-full flex-col gap-6">
                        <UpdateCategoryForm {...props} />

                        {selectedCategory && (
                            <ManageCategoryImage
                                onDelete={onDeleteCategoryImage}
                                onUpload={onUpdateCategoryImages}
                                category={selectedCategory}
                            />
                        )}
                    </div>
                )}
            />

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
