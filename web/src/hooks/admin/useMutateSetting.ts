import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SiteSetting, SiteSettings } from "../../types/SiteSetting";
import AdminService from "../../services/AdminService";
import { makeSiteSettingQueryKey } from "../useSiteSettings";

export function useMutateSetting<K extends SiteSetting>(key: K) {
    const queryClient = useQueryClient();

    const {
        mutateAsync: saveSetting,
        isSuccess,
        isPending,
    } = useMutation({
        mutationFn: (value: SiteSettings[K]) =>
            AdminService.saveSetting(key, value),
        onSuccess: (_, value) => {
            queryClient.setQueryData(makeSiteSettingQueryKey(key), value);
        },
    });

    return { saveSetting, isSuccess, isPending };
}
