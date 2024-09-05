import { create } from "zustand";

import { RegisterPayload, User, UserFavorite } from "../types/User";
import UserService from "../services/UserService";
import { AxiosError } from "axios";
import { useEffect, useMemo } from "react";
import StripeService from "../services/StripeService";

export type PaymentMethod = {
    id: string;
    exp_year: number;
    exp_month: number;
    last4: string;
    display_brand: string;
};

export type UserStore = {
    user: null | User;
    favorites: UserFavorite[];
    paymentMethod: PaymentMethod | null;
    hasLoadedFavorites: boolean;
    isLoadingFavorites: boolean;
    isLoading: boolean;
    loadFavorites: () => Promise<void>;
    addFavorite: (id_item: number) => Promise<void>;
    removeFavorite: (id_item: number) => Promise<void>;
    setPaymentMethod: (pm: PaymentMethod | null) => void;
    getPaymentMethod: () => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    register: (data: RegisterPayload) => Promise<void>;
    logout: () => Promise<void>;
    refresh: () => Promise<User | null>;
};
const useUserStore = create<UserStore>((set, get) => {
    const login = async (email: string, password: string) => {
        try {
            const { user, paymentMethod } = await UserService.login(
                email,
                password
            );
            set({ user, paymentMethod });
        } catch (err) {
            if (err instanceof AxiosError) {
                console.error(err.response?.data || err.message);
            }

            set({ user: null });

            throw err;
        }
    };
    const register = async (data: RegisterPayload) => {
        try {
            const user = await UserService.register(data);
            set({ user });
        } catch (err) {
            if (err instanceof AxiosError) {
                console.error(err.response?.data || err.message);
            }

            set({ user: null });

            throw err;
        }
    };
    const logout = async () => {
        set({ user: null, paymentMethod: null, favorites: [] });

        try {
            await UserService.logout();
        } catch (err) {
            if (err instanceof AxiosError) {
                console.error(err.response?.data || err.message);
            }

            throw err;
        }
    };
    const refresh = async () => {
        set({ isLoading: true });

        try {
            const { user, paymentMethod } = await UserService.me();
            set({ user, paymentMethod });

            return user;
        } catch (err) {
            if (err instanceof AxiosError) {
                console.error(err.response?.data || err.message);
            }
            set({ user: null });

            return null;
        } finally {
            set({ isLoading: false });
        }
    };
    const setPaymentMethod = (paymentMethod: PaymentMethod | null) => {
        set({ paymentMethod });
    };
    const getPaymentMethod = async () => {
        const paymentMethod = await StripeService.getPaymentMethod();
        set({ paymentMethod });
    };

    const loadFavorites = async () => {
        try {
            set({ isLoadingFavorites: true });
            const favorites = await UserService.getUserFavorites();

            set({
                favorites,
                isLoadingFavorites: false,
                hasLoadedFavorites: true,
            });
        } catch (err) {
            console.warn("Error loading favorites", err);
            set({ isLoadingFavorites: false });
        }
    };

    const addFavorite = async (id_item: number) => {
        try {
            const favorite = await UserService.addFavorite(id_item);

            const fs = [...get().favorites];
            const foundIndex = fs.findIndex(
                (f) => f.id_favorite === favorite.id_favorite
            );
            if (foundIndex > -1) {
                fs.splice(foundIndex, 1, favorite);
            } else {
                fs.push(favorite);
            }

            set({ favorites: fs });
        } catch (err) {
            console.warn("Error saving favorite", err);
        }
    };

    const removeFavorite = async (id_item: number) => {
        try {
            await UserService.removeFavorite(id_item);
            const fs = get().favorites;

            set({
                favorites: fs.filter((f) => f.id_item !== id_item),
            });
        } catch (err) {
            console.warn("Error saving favorite", err);
        }
    };

    return {
        user: null,
        paymentMethod: null,
        isLoading: false,
        login,
        register,
        logout,
        refresh,
        setPaymentMethod,
        getPaymentMethod,
        favorites: [],
        isLoadingFavorites: false,
        hasLoadedFavorites: false,
        loadFavorites,
        addFavorite,
        removeFavorite,
    } satisfies UserStore;
});

export function useUserInitials() {
    const user = useUserStore((state) => state.user);

    const initials = useMemo(() => {
        if (user) {
            const names = user.name.split(" ");
            return names
                .map((name) => name[0])
                .join("")
                .toUpperCase();
        }

        return null;
    }, [user]);

    return initials;
}

export function useWatchUserSession(
    callback?: (user: User | null) => void | Promise<void>
) {
    const { refresh, logout, user } = useUserStore();

    useEffect(() => {
        const syncUserSession = async () => {
            try {
                if (typeof callback === "function") {
                    await callback(user);
                }
            } catch {
                logout();

                if (typeof callback === "function") {
                    await callback(null);
                }
            }
        };

        syncUserSession();
    }, [user]);

    useEffect(() => {
        refresh();
    }, []);
}

export default useUserStore;
