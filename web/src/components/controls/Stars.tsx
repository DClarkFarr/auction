import { ProductQuality } from "../../types/Product";
import { cls } from "../../utils/attributes";

import StarIcon from "~icons/ic/baseline-star-rate";

export default function Stars({
    value,
    onClick,
    readOnly = false,
    size = 16,
}: {
    value: ProductQuality;
    readOnly?: boolean;
    onClick?: (val: ProductQuality) => void;
    size?: number;
}) {
    const colorMap = {
        1: "text-red-700",
        2: "text-orange-700",
        3: "text-yellow-700",
        4: "text-emerald-700",
        5: "text-green-700",
    };

    const shadowMap = {
        red: "248, 113, 113", // "#f87171",
        orange: "251, 146, 60", // "#fb923c",
        yellow: "251, 191, 36", // "#fbbf24",
        emerald: "52, 211, 153", // "#34d399",
        green: "74, 222, 128", // "#4ade80",
        gray: "156, 163, 175", // #9ca3af
    };

    const parentClass = readOnly ? "opacity-100" : "opacity-80 hover:opacity-1";

    const gap = Math.max(0, Math.floor(size * 0.5) - 8);

    const renderCount = readOnly ? value : 5;

    const handleClick = (val: ProductQuality) => () => {
        if (readOnly) {
            return;
        }
        if (typeof onClick === "function") {
            onClick(val);
        }
    };

    return (
        <div
            className={cls(
                "stars flex items-center",
                `text-${size}px`,
                parentClass
            )}
            style={{
                columnGap: `${gap}px`,
            }}
        >
            {Array.from(
                { length: renderCount },
                (_, i: number) => (i + 1) as ProductQuality
            ).map((val) => {
                const color = val <= value ? colorMap[value] : "text-gray-600";
                const split = color.split("-");
                const shadow = shadowMap[split[1] as keyof typeof shadowMap];

                return (
                    <div
                        className={cls(
                            "star p-1 rounded",
                            readOnly ? "" : "cursor-pointer"
                        )}
                        onClick={handleClick(val)}
                        key={val}
                    >
                        <div className={cls("star-wrapper")}>
                            <StarIcon
                                className={color}
                                style={{
                                    filter: `drop-shadow(1px 1px 2px rgb(${shadow}))`,
                                }}
                            />
                        </div>
                    </div>
                );
            })}

            <div className="hidden">
                <div className="text-red-700 text-orange-700 text-yellow-700 text-emerald-700 text-green-700 bg-red-400 bg-orange-400 bg-yellow-400 bg-emerald-400 bg-green-400 hover:bg-gray-100"></div>
            </div>
        </div>
    );
}
