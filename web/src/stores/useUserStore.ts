import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { User } from "../types/User";
import UserService from "../services/UserService";
import { AxiosError } from "axios";

export type UserStore = {
    user: null | User;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
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
                        const user = await UserService.login(email, password);
                        set({ user });
                    } catch (err) {
                        if (err instanceof AxiosError) {
                            console.error(err.response?.data || err.message);
                        }

                        set({ user: null });
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

export default useUserStore;
