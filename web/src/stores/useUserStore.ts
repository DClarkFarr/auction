import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { RegisterPayload, User } from "../types/User";
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
    paymentMethod: PaymentMethod | null;
    isLoading: boolean;
    setPaymentMethod: (pm: PaymentMethod | null) => void;
    getPaymentMethod: () => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    register: (data: RegisterPayload) => Promise<void>;
    logout: () => Promise<void>;
    refresh: () => Promise<User | null>;
};
const useUserStore = create(
    persist<UserStore>(
        (set) => {
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
                set({ user: null, paymentMethod: null });

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
            } satisfies UserStore;
        },
        {
            name: "user-session",
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);

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
