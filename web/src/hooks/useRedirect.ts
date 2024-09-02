import { useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function useRedirect(defaultPath = "/") {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const toRedirect = useMemo(() => {
        let redirect = defaultPath;

        if (searchParams.has("redirect")) {
            const requested = decodeURIComponent(
                searchParams.get("redirect") || ""
            );
            if (requested.startsWith("/")) {
                redirect = requested;
            }
        }

        return redirect;
    }, [searchParams, defaultPath]);

    const redirect = useCallback(() => {
        navigate(toRedirect);
    }, [toRedirect]);

    return {
        redirect,
        toRedirect,
    };
}
