import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { RegisterPayload, User } from "../types/User";
import UserService from "../services/UserService";
import { AxiosError } from "axios";
import { useEffect, useMemo } from "react";
import { STORAGE_KEY } from "../services/apiClient";

export type UserStore = {
    user: null | User;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: RegisterPayload) => Promise<void>;
    logout: () => Promise<void>;
    refresh: () => Promise<User | null>;
};
const useUserStore = create(
    persist<UserStore>(
        (set) => {
            return {
                user: null,
                isLoading: false,
                login: async (email: string, password: string) => {
                    try {
                        await UserService.login(email, password);
                    } catch (err) {
                        if (err instanceof AxiosError) {
                            console.error(err.response?.data || err.message);
                        }

                        set({ user: null });

                        throw err;
                    }
                },
                register: async (data: RegisterPayload) => {
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
                },
                logout: async () => {
                    set({ user: null });

                    try {
                        await UserService.logout();
                    } catch (err) {
                        if (err instanceof AxiosError) {
                            console.error(err.response?.data || err.message);
                        }

                        throw err;
                    }
                },
                refresh: async () => {
                    set({ isLoading: true });

                    try {
                        const user = await UserService.me();
                        set({ user });

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
                },
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
        console.log("recalcualting user initials", { ...user });
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

export function useWatchUserSession() {
    const { refresh } = useUserStore();

    useEffect(() => {
        refresh();

        const handleSessionEvent = (event: StorageEvent) => {
            if (event.key === STORAGE_KEY) {
                console.log("Session storage has changed", event);
                refresh();
            }
        };

        window.addEventListener("storage", handleSessionEvent);

        return () => {
            window.removeEventListener("storage", handleSessionEvent);
        };
    }, []);
}

export default useUserStore;
