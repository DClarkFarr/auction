import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AdminService from "../../services/AdminService";
import { Category } from "../../types/Product";
import { UpdateCategoryFormState } from "../../components/category/UpdateCategoryForm";
import { useMemo } from "react";

export function useUpdateCategory() {
    const queryClient = useQueryClient();

    const refresh = <C extends Category>(category: C) => {
        if (category) {
            queryClient.setQueryData(
                ["category", category.id_category],
                category
            );
        } else {
            queryClient.invalidateQueries({
                queryKey: ["category"],
                exact: false,
            });
        }
        queryClient.invalidateQueries({
            queryKey: ["categories"],
            exact: false,
        });

        queryClient.invalidateQueries({
            queryKey: ["paginatedCategories"],
            exact: false,
        });
    };

    const { mutateAsync: mutateUpdate } = useMutation({
        mutationFn: ({
            idCategory,
            data,
        }: {
            idCategory: number;
            data: UpdateCategoryFormState;
        }) => {
            return AdminService.updateCategory(idCategory, data);
        },
        onSuccess: (category) => {
            refresh(category);
        },
    });

    const update = (idCategory: number, data: UpdateCategoryFormState) =>
        mutateUpdate({ idCategory, data });

    return { update, refresh };
}
export function useCreateCategory() {
    const queryClient = useQueryClient();

    const { mutateAsync: mutateCreateCategory } = useMutation({
        mutationFn: ({ label }: { label: string }) => {
            return AdminService.createCategory({ label });
        },
        onSuccess: (category) => {
            queryClient.invalidateQueries({
                queryKey: ["category", category.id_category],
            });

            const categories =
                queryClient.getQueryData<Category[]>(["categories"]) || [];

            queryClient.setQueryData(
                ["categories"],
                [...categories, category].sort((a, b) =>
                    a.label.localeCompare(b.label)
                )
            );
        },
    });

    const create = (categoryLabel: string) =>
        mutateCreateCategory({ label: categoryLabel });

    return { create };
}
export default function useCategoryQuery(idCategory: number) {
    const queryClient = useQueryClient();

    const {
        data: category,
        isLoading,
        error,
        isSuccess,
    } = useQuery({
        queryKey: ["category", idCategory],
        queryFn: () => AdminService.getCategory(idCategory),
    });

    const { create } = useCreateCategory();

    const { update: updateMutate } = useUpdateCategory();

    const update = useMemo(() => {
        return (data: UpdateCategoryFormState) =>
            updateMutate(idCategory, data);
    }, [idCategory]);

    const refresh = () => {
        queryClient.refetchQueries({
            queryKey: ["category", idCategory],
        });
    };

    return {
        category,
        isLoading,
        error,
        isSuccess,
        refresh,
        create,
        update,
    };
}
