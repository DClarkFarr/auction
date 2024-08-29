import { createContext } from "react";
import { useSiteSetting } from "../hooks/useSiteSettings";
import { SiteSetting } from "../types/SiteSetting";

export type SiteSettingContexts = {
    [K in SiteSetting]: ReturnType<typeof useSiteSetting<K>>;
};

export const SettingContext = createContext(
    {} as SiteSettingContexts[SiteSetting]
);

function Provider<K extends SiteSetting>({
    setting,
    children,
}: React.PropsWithChildren<{
    setting: K;
}>) {
    const query = useSiteSetting(setting) as SiteSettingContexts[K];

    return (
        <SettingContext.Provider value={query}>
            {children}
        </SettingContext.Provider>
    );
}

function ScopedSettingNamespace<K extends SiteSetting>({
    setting,
    children,
}: React.PropsWithChildren<{ setting: K }>) {
    return <Provider setting={setting}>{children}</Provider>;
}

export const ScopedSetting = Object.assign(ScopedSettingNamespace, {
    Provider,
});
