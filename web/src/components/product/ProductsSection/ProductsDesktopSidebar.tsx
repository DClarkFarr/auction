import React, { ReactNode, useMemo } from "react";
import { useIsMinBreakpoint } from "../../../hooks/useWindowBreakpoints";
import useCategoriesQuery from "../../../hooks/useCategoriesQuery";
import CategoriesIcon from "~icons/ic/baseline-category";
import UncheckedIcon from "~icons/ic/baseline-check-box-outline-blank";
import CheckedIcon from "~icons/ic/baseline-check-box";
import { useProductsContext } from "../../../providers/useProductsContext";
import StarIcon from "~icons/ic/baseline-star-rate";
import Stars from "../../controls/Stars";
import { ProductQuality } from "../../../types/Product";
import MoneyIcon from "~icons/ic/baseline-attach-money";
import { formatCurrency } from "../../../utils/currency";
import { createPortal } from "react-dom";

export default function ProductsDesktopSidebar({
    children,
    teleportMobile,
}: {
    children: React.ReactNode;
    teleportMobile?: React.RefObject<HTMLDivElement>;
}) {
    const isDesktop = useIsMinBreakpoint("lg");

    if (!isDesktop) {
        if (teleportMobile?.current) {
            return createPortal(<>{children}</>, teleportMobile.current);
        }
        return null;
    }

    return (
        <div className="products-sidebar w-1/4 min-w-[200px] max-w-[250px] shrink flex flex-col gap-y-4">
            {children}
        </div>
    );
}

export function SidebarBlock({
    children,
    icon,
    title,
}: {
    children: React.ReactNode;
    title: ReactNode;
    icon?: ReactNode;
}) {
    return (
        <div className="sidebar-block bg-gray-100 p-4 flex flex-col w-full divide-y gap-y-3">
            <div className="sidebar-block__heading flex gap-x-3 items-center">
                {!!icon && <div className="sidebar-block__icon">{icon}</div>}
                <div className="sidebar-block__title">
                    {typeof title === "string" && (
                        <h2 className="text-lg font-semibold">{title}</h2>
                    )}
                    {typeof title !== "string" && title}
                </div>
            </div>
            <div className="sidebar-block__body pt-3">{children}</div>
        </div>
    );
}

function FilterItem<V>({
    badge,
    active,
    value,
    label,
    onClick,
}: {
    badge?: React.ReactNode;
    active: boolean;
    value: V;
    label: React.ReactNode;
    onClick: (value: V, isActive?: boolean) => void;
}) {
    return (
        <div
            onClick={() => onClick(value)}
            className={`filter-item flex items-center gap-x-1 px-2 py-1 text-sm bg-white rounded border-2 cursor-pointer hover:bg-purple-100 ${
                active ? "border-purple-600" : "border-gray-300"
            }`}
        >
            <div className="filter-item__check w-[25px] shrink">
                {active ? (
                    <CheckedIcon className="text-purple-700" />
                ) : (
                    <UncheckedIcon />
                )}
            </div>
            <div className="filter-item__title">{label}</div>
            {typeof badge !== "undefined" && (
                <>
                    {typeof badge !== "object" ? (
                        <div
                            className={`bg-purple-600 text-white leading-none py-1 px-2 rounded-full ml-auto`}
                        >
                            {badge}
                        </div>
                    ) : (
                        badge
                    )}
                </>
            )}
        </div>
    );
}

export function ProductsSidebarCategories({
    multiple = false,
}: {
    multiple?: boolean;
}) {
    const { categories } = useCategoriesQuery(true, true);
    const { params, setParams } = useProductsContext();

    const categoryIds = params.categoryIds || [];

    const sortedCategories = useMemo(() => {
        if (!categories) {
            return [];
        }
        return categories.sort((a, b) => {
            if (b.productCount !== a.productCount) {
                return b.productCount - a.productCount;
            }

            return a.label.localeCompare(b.label);
        });
    }, [categories]);

    const handleToggleCategory = (idCategory: number) => {
        const exists = categoryIds.indexOf(idCategory) > -1;
        if (multiple) {
            if (exists) {
                setParams({
                    page: 1,
                    categoryIds: categoryIds.filter((id) => id !== idCategory),
                });
            } else {
                setParams({
                    page: 1,
                    categoryIds: [...categoryIds, idCategory],
                });
            }
        } else {
            if (exists) {
                setParams({ page: 1, categoryIds: [] });
            } else {
                setParams({ page: 1, categoryIds: [idCategory] });
            }
        }
    };

    return (
        <SidebarBlock title="Categories" icon={<CategoriesIcon />}>
            <div className="flex flex-col w-full gap-y-1">
                {sortedCategories.map((c) => {
                    return (
                        <FilterItem
                            key={c.id_category}
                            label={c.label}
                            value={c.id_category}
                            active={categoryIds.includes(c.id_category)}
                            onClick={handleToggleCategory}
                            badge={c.productCount}
                        />
                    );
                })}
            </div>
        </SidebarBlock>
    );
}

export function ProductsSidebarQualities() {
    const { params, setParams } = useProductsContext();

    const quality = params.quality as ProductQuality;

    const values = Array.from(
        { length: 5 },
        (_, i) => 5 - i
    ) as ProductQuality[];

    const onToggleQuality = (q: ProductQuality) => {
        if (q === quality) {
            setParams({ page: 1, quality: undefined });
        } else {
            setParams({ page: 1, quality: q });
        }
    };

    return (
        <SidebarBlock title="Quality" icon={<StarIcon />}>
            {values.map((v) => (
                <FilterItem
                    key={v}
                    value={v}
                    label={<Stars value={v} readOnly />}
                    active={quality === v}
                    onClick={onToggleQuality}
                />
            ))}
        </SidebarBlock>
    );
}

export function ProductSidebarPrices() {
    const { params, setParams } = useProductsContext();

    const priceMin = params.priceMin;

    const priceRanges = [
        {
            min: 1,
            max: 5,
        },
        {
            min: 6,
            max: 15,
        },
        {
            min: 16,
            max: 25,
        },
        {
            min: 26,
        },
    ];

    const handleToggleRange = (index: number) => {
        if (priceRanges[index].min === priceMin) {
            setParams({ page: 1, priceMin: undefined, priceMax: undefined });
        } else {
            const range = priceRanges[index]!;
            setParams({ page: 1, priceMin: range.min, priceMax: range.max });
        }
    };
    return (
        <SidebarBlock title="Price Range" icon={<MoneyIcon />}>
            {priceRanges.map(({ min, max }, i) => {
                const active = min === priceMin;

                let label = formatCurrency(min);
                if (max) {
                    label += " - " + formatCurrency(max);
                }
                return (
                    <FilterItem
                        key={i}
                        label={label}
                        value={i}
                        active={active}
                        onClick={handleToggleRange}
                    />
                );
            })}
        </SidebarBlock>
    );
}
