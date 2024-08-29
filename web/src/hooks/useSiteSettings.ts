import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { SiteSetting, SiteSettings } from "../types/SiteSetting";
import SiteService from "../services/SiteService";

export function makeSiteSettingQueryKey(key: SiteService) {
    return ["siteSetting", key];
}
export function useSiteSetting<K extends SiteSetting>(key: K) {
    const queryClient = useQueryClient();

    const {
        data: setting,
        isLoading,
        isSuccess,
        error,
    } = useQuery({
        queryKey: makeSiteSettingQueryKey(key),
        queryFn: () => SiteService.getSetting<SiteSettings[K]>(key),
    });

    const refresh = () => {
        queryClient.invalidateQueries({
            queryKey: makeSiteSettingQueryKey(key),
        });
    };

    return {
        setting,
        isLoading,
        isSuccess,
        error,
        refresh,
    };
}

type MapSiteSettingResult<V extends SiteSettings[SiteSetting]> = {
    setting: V | undefined;
    isLoading: boolean;
    isSuccess: boolean;
    error: Error | null;
    refresh: () => void;
};
type MapSettingsToResults<KS extends SiteSetting[]> = {
    [I in keyof KS]: MapSiteSettingResult<SiteSettings[KS[I]]>;
};

export function useSiteSettings<K extends SiteSetting[]>(...keys: K) {
    const datas = useQueries({
        queries: keys.map((key) => ({
            queryKey: makeSiteSettingQueryKey(key),
            queryFn: () => SiteService.getSetting(key),
        })),
    });

    const queryClient = useQueryClient();

    const mapped = datas.map(({ data, isLoading, isSuccess, error }, i) => ({
        setting: data,
        isLoading,
        isSuccess,
        error,
        refresh: () =>
            queryClient.invalidateQueries({
                queryKey: makeSiteSettingQueryKey(keys[i]),
            }),
    }));

    return mapped as MapSettingsToResults<K>;
}

// const [d, k] = useSiteSettings("featuredCategories", "featuredProducts");

// d.setting?.forEach((s) => {
//     var description = s.description;
// })
