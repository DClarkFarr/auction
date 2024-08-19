import { useWindowSize } from "@uidotdev/usehooks";
import { useMemo } from "react";

const sizes = {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
};

export function useWindowBreakpoints() {
    const { width } = useWindowSize();

    const currentBreakpoint = useMemo(() => {
        let size: keyof typeof sizes = "xs";
        const keys = Object.keys(sizes) as Array<keyof typeof sizes>;
        for (let i = 0; i < keys.length; i++) {
            const thisSize = keys[i];
            if (sizes[thisSize] <= (width || 0)) {
                size = thisSize;
            } else {
                break;
            }
        }

        return size;
    }, [width]);

    return {
        breakpoint: currentBreakpoint,
    };
}

export function useIsMinBreakpoint(breakpoint: keyof typeof sizes) {
    const { breakpoint: currentBreakpoint } = useWindowBreakpoints();

    const isMinBreakpoint = useMemo(() => {
        return sizes[currentBreakpoint] >= sizes[breakpoint];
    }, [breakpoint, currentBreakpoint]);

    return isMinBreakpoint;
}
