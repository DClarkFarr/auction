import React from "react";
import useUserStore from "../stores/useUserStore";
import { keyBy } from "lodash-es";

export default function useFavorite() {
    const {
        user,
        favorites,
        addFavorite: addFavoriteQuery,
        removeFavorite: removeFavoriteQuery,
    } = useUserStore();

    const favoritesKeyed = React.useMemo(() => {
        return keyBy(favorites, "id_item");
    }, [favorites]);

    const itemIsFavorite = React.useCallback(
        (id_item: number) => {
            return !!favoritesKeyed[id_item] || false;
        },
        [favoritesKeyed]
    );

    const addFavorite = React.useCallback(
        (id_item: number) => {
            if (!user) {
                throw new Error("Show login modal!");
            }

            return addFavoriteQuery(id_item);
        },
        [user]
    );

    const removeFavorite = React.useCallback(
        (id_item: number) => {
            if (!user) {
                throw new Error("Show login modal!");
            }

            return removeFavoriteQuery(id_item);
        },
        [user]
    );

    return {
        favorites,
        favoritesKeyed,
        itemIsFavorite,
        addFavorite,
        removeFavorite,
    };
}
