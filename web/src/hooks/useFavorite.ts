import React from "react";
import useUserStore from "../stores/useUserStore";
import { keyBy } from "lodash-es";
import { useLoginModal } from "../stores/useModalsStore";

export default function useFavorite() {
    const {
        user,
        favorites,
        addFavorite: addFavoriteQuery,
        removeFavorite: removeFavoriteQuery,
    } = useUserStore();

    const loginModal = useLoginModal();

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
                return loginModal.open(
                    {},
                    {
                        scope: "login",
                        callback: () => {
                            addFavoriteQuery(id_item);
                        },
                    }
                );
            }

            return addFavoriteQuery(id_item);
        },
        [user]
    );

    const removeFavorite = React.useCallback(
        (id_item: number) => {
            if (!user) {
                return loginModal.open(
                    {},
                    {
                        scope: "login",
                        callback: () => {
                            removeFavoriteQuery(id_item);
                        },
                    }
                );
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
