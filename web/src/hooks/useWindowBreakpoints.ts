import { useEffect, useMemo, useRef, useState } from "react";

const sizes = {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
};

export function useWindowBreakpoints() {
    const [currentBreakpoint, setCurrentBreakpoint] =
        useState<keyof typeof sizes>("lg");
    const breakpointRef = useRef<keyof typeof sizes>("lg");

    const getCurrentSize = () => {
        let size: keyof typeof sizes = "xs";
        const keys = Object.keys(sizes) as Array<keyof typeof sizes>;
        for (let i = 0; i < keys.length; i++) {
            const thisSize = keys[i];
            if (sizes[thisSize] <= window.innerWidth) {
                size = thisSize;
            } else {
                break;
            }
        }

        return size;
    };
    const checkWidthVsBreakpoint = (size: keyof typeof sizes) => {
        if (size !== breakpointRef.current) {
            setCurrentBreakpoint(size);
            breakpointRef.current = size;
        }
    };

    useEffect(() => {
        const handler = () => {
            checkWidthVsBreakpoint(getCurrentSize());
        };
        window.addEventListener("resize", handler);

        handler();

        return () => window.removeEventListener("resize", handler);
    }, []);

    return currentBreakpoint;
}

export function useIsMinBreakpoint(breakpoint: keyof typeof sizes) {
    const currentBreakpoint = useWindowBreakpoints();

    const isMinBreakpoint = useMemo(() => {
        return sizes[currentBreakpoint] >= sizes[breakpoint];
    }, [breakpoint, currentBreakpoint]);

    return isMinBreakpoint;
}

export function useIsMaxBreakpoint(breakpoint: keyof typeof sizes) {
    const currentBreakpoint = useWindowBreakpoints();

    const isMaxBreakpoint = useMemo(() => {
        return sizes[currentBreakpoint] <= sizes[breakpoint];
    }, [breakpoint, currentBreakpoint]);

    return isMaxBreakpoint;
}
