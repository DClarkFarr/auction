import { useQuery } from "@tanstack/react-query";
import SiteService from "../services/SiteService";

export default function useTagsQuery() {
    const {
        data: tags,
        isLoading,
        isSuccess,
        error,
    } = useQuery({
        queryKey: ["tags"],
        queryFn: () => SiteService.getTags(),
    });

    return {
        tags: tags || [],
        isLoading,
        isSuccess,
        error,
    };
}
