import { createContext, useContext } from "react";

export function contextFactory<C extends object>() {
    const Context = createContext<C>({} as C);

    const useMethod = () => useContext(Context);

    return [Context, useMethod] as const;
}
