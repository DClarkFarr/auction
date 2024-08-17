import { useMotionValue, useTransform, motion, animate } from "framer-motion";
import { ReactNode, useEffect, useRef } from "react";

export default function SlideUpDown({
    show,
    duration = 0.3,
    children,
}: {
    show: boolean;
    duration: number;
    children: ReactNode;
}) {
    const element = useRef<HTMLDivElement>(null);
    const o = useMotionValue(0);
    const opacity = useTransform(o, [0, 1], [0, 1]);

    const y = useMotionValue(0);
    const translateY = useTransform(y, [0, 1], [-100, 0]);

    const h = useMotionValue(0);
    const height = useTransform(h, (v) => {
        const toSet =
            v === 0
                ? 0
                : element.current?.clientHeight
                ? element.current.clientHeight * v
                : "auto";

        return toSet;
    });

    useEffect(() => {
        const animateH = animate(h, show ? 1 : 0, {
            duration: duration * 0.8,
            ease: "easeOut",
        });
        const animateO = animate(o, show ? 1 : 0, {
            duration,
            ease: "easeOut",
            delay: duration * 0.25,
        });

        const animateY = animate(y, show ? 1 : 0, {
            duration,
            ease: "easeOut",
        });

        return () => (animateO.stop(), animateY.stop(), animateH.stop());
    }, [show]);

    return (
        <motion.div className="overflow-hidden" style={{ height }}>
            <motion.div
                className="relative"
                ref={element}
                style={{ opacity, y: translateY }}
            >
                {children}
            </motion.div>
        </motion.div>
    );
}
