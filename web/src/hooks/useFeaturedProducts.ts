import { useQuery, useQueryClient } from "@tanstack/react-query";
import SiteService from "../services/SiteService";
import { FullProductItem } from "../types/Product";
import React from "react";

export default function useFeaturedProducts() {
    const queryClient = useQueryClient();

    const {
        data: featuredProducts,
        isLoading,
        isSuccess,
        error,
    } = useQuery({
        queryKey: ["featuredProducts"],
        queryFn: () => SiteService.getFeaturedProducts(),
    });

    const updateFeaturedProduct = React.useCallback(
        (
            product: FullProductItem,
            onMutateItem: (item: FullProductItem) => FullProductItem
        ) => {
            queryClient.setQueryData<typeof featuredProducts>(
                ["featuredProducts"],
                (result) => {
                    if (!result) {
                        return;
                    }

                    return result.map((row) => {
                        if (row.item.id_item === product.id_item) {
                            return { ...row, item: onMutateItem(row.item) };
                        }

                        return row;
                    });
                }
            );
        },
        [queryClient]
    );

    return {
        featuredProducts: featuredProducts || [],
        updateFeaturedProduct,
        isLoading,
        isSuccess,
        error,
    };
}
