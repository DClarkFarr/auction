import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import ProductsProvider from "../../providers/ProductsProvider";
import { useSearchParams } from "react-router-dom";
import { useProductsContext } from "../../providers/useProductsContext";
import {
    getProductQueryParams,
    setProductQueryParams,
} from "../../utils/productParams";

import { PaginatedProductParams } from "../../services/SiteService";
import { FullProductItem } from "../../types/Product";
import { Banner, Button, Carousel, Tooltip } from "flowbite-react";
import EmptyIcon from "~icons/ic/baseline-help";
import { useIsMinBreakpoint } from "../../hooks/useWindowBreakpoints";
import { uploadedAsset } from "../../utils/asset";

import IconLiked from "~icons/ic/baseline-favorite";
import IconUnliked from "~icons/ic/baseline-favorite-border";
import { formatCurrency } from "../../utils/currency";
import Stars from "../controls/Stars";
import { DateTime } from "luxon";
import { useWindowScroll } from "@uidotdev/usehooks";

const timeCompareMulti = (
    timeBefore: DateTime,
    timeAfter: DateTime,
    maxSegmengs = 2,
    suffix = ""
) => {
    const { hours, minutes, seconds, days } = timeAfter.diff(timeBefore, [
        "hours",
        "minutes",
        "seconds",
        "days",
    ]);

    const segments = [
        [days, "day"] as [number, string],
        [hours, "hr"] as [number, string],
        [minutes, "min"] as [number, string],
        [seconds, "sec"] as [number, string],
    ]
        .filter(([n]) => n >= 1)
        .map(([number, word]) => {
            const n = Math.floor(number);
            return `${n} ${word}${suffix ? ` ${suffix}` : ""}`;
        });

    return segments.slice(0, maxSegmengs);
};
const timeCompare = (
    timeBefore: DateTime,
    timeAfter: DateTime,
    suffix = ""
) => {
    const { hours, minutes, seconds, days } = timeAfter.diff(timeBefore, [
        "hours",
        "minutes",
        "seconds",
        "days",
    ]);

    if (seconds < 1) {
        return "Now";
    }

    if (minutes < 1) {
        return `${Math.floor(seconds)} seconds${suffix ? ` ${suffix}` : ""}`;
    }
    if (hours < 1) {
        return `${Math.floor(minutes)} minutes${suffix ? ` ${suffix}` : ""}`;
    }
    if (days < 1) {
        return `${Math.floor(hours)} hours${suffix ? ` ${suffix}` : ""}`;
    }

    return `${Math.floor(days)} days${suffix ? ` ${suffix}` : ""}`;
};

function ProductsSectionWrapper({
    children,
    params: overrideParams,
}: React.PropsWithChildren<{ params?: Partial<PaginatedProductParams> }>) {
    const [search] = useSearchParams();

    const params = useMemo(() => {
        return { ...getProductQueryParams(search), ...overrideParams };
    }, [search, overrideParams]);

    return (
        <div className="products-section">
            <ProductsProvider params={params}>
                <UrlParamsSync />
                {children}
            </ProductsProvider>
        </div>
    );
}

function UrlParamsSync() {
    const { params } = useProductsContext();
    const [search, setSearch] = useSearchParams();

    useEffect(() => {
        const toSet = setProductQueryParams(params, search);

        setSearch(toSet);
    }, [params, search]);

    return <></>;
}

export type ProductsItemProps = {
    product: FullProductItem;
};
export type ProductsGridItem<P extends ProductsItemProps = ProductsItemProps> =
    (props: P) => React.ReactNode;

const ProductsItem: ProductsGridItem = ({ product }) => {
    const isLiked = false;

    const retailPrice = product.product.priceRetail;
    const currentPrice = product.bid
        ? product.bid.amount
        : product.product.priceInitial;

    const savingsPercent = parseFloat(
        ((1 - currentPrice / retailPrice) * 100).toFixed(1)
    );

    const calulateTimeData = (p: ProductsItemProps["product"]) => {
        const expiresAt = DateTime.fromISO(p.expiresAt);
        const now = DateTime.now();

        const isExpired = expiresAt <= now || !!p.expiredAt;
        const isDateExpired = expiresAt <= now;

        const timeAfterExpired = isDateExpired
            ? timeCompare(expiresAt, now, "ago")
            : false;

        const timeUntilExpired = !isDateExpired
            ? timeCompareMulti(now, expiresAt)
            : (false as const);

        const isInactive =
            p.canceledAt || p.purchasedAt || p.status !== "active";

        const borderColor = isExpired
            ? "border-red-600"
            : isInactive
            ? "border-gray-600"
            : "border-purple-600";

        const backgroundColor = isExpired
            ? "bg-red-100"
            : isInactive
            ? "bg-gray-100"
            : "bg-white";

        /**
         * TODO - Caculate if won
         * - If won, make bg green
         * - if won, but not claimed, make green "claimed" button
         * - if one and claimed, make disabled green "claimed" button
         * - maybe add: "congrats, you won for $$$ divid-y section"
         */

        return {
            borderColor,
            timeAfterExpired,
            timeUntilExpired,
            isInactive,
            isExpired,
            isDateExpired,
            backgroundColor,
        };
    };

    const [timeData, setTimeData] = useState(calulateTimeData(product));

    useEffect(() => {
        const id = window.setInterval(() => {
            setTimeData(calulateTimeData(product));
        }, 1000);

        return () => {
            window.clearInterval(id);
        };
    }, [product]);

    const {
        borderColor,
        timeAfterExpired,
        timeUntilExpired,
        isExpired,
        backgroundColor,
        // isInactive,
        // isDateExpired,
    } = timeData;

    return (
        <div
            className={`item border-2 border-purple-600 shadow-lg ${backgroundColor} ${borderColor}`}
        >
            <div className="item__heading">
                <div className="h-[85px] flex w-full items-center p-3">
                    <div className="text-ellipsis overflow-hidden max-h-[61px] line-clamp-2">
                        <h4 className="text-lg font-bold">
                            {product.product.name}
                        </h4>
                    </div>
                </div>
            </div>
            <div className="item__carousel relative">
                <div className="relative aspect-[2] w-full">
                    {product.product?.images?.length > 0 && (
                        <Carousel
                            theme={{
                                scrollContainer: {
                                    base: "flex h-full snap-mandatory overflow-y-hidden overflow-x-scroll scroll-smooth",
                                },
                            }}
                            rightControl={" "}
                            leftControl={" "}
                            slide={false}
                        >
                            {product.product.images.map((img) => {
                                return (
                                    <img
                                        key={img.id_image}
                                        className="block h-full object-fit object-center object-cover"
                                        src={uploadedAsset(img.path)}
                                        alt={img.alt}
                                    />
                                );
                            })}
                        </Carousel>
                    )}
                    {!product.product?.images?.length && (
                        <>
                            <img
                                className="block h-full w-full object-fit object-center object-cover"
                                src={"https://placehold.co/400x225"}
                                alt="No image"
                            />
                        </>
                    )}
                </div>
                <div className="likes absolute top-2 right-2">
                    <Tooltip
                        className="whitespace-nowrap"
                        content={isLiked ? "Remove favorite" : "Add Favorite"}
                    >
                        <Button size="sm" color={isLiked ? "#a21caf" : "light"}>
                            {isLiked ? <IconLiked /> : <IconUnliked />}
                        </Button>
                    </Tooltip>
                </div>
            </div>

            <div className="item__price p-2 bg-gray-200  flex gap-4">
                <div className="text-center w-1/2 bg-white p-2">
                    <div className="text-sm text-gray-500">Retail price</div>
                    <div className="text-lg font-thin text-red-600 line-through">
                        {formatCurrency(retailPrice)}
                    </div>
                </div>
                <div className="text-center w-1/2 bg-white p-2">
                    <div className="text-sm text-gray-500">Current price</div>
                    <div className="text-lg font-bold text-emerald-600">
                        {formatCurrency(currentPrice)}
                    </div>
                </div>
            </div>

            <div className="divide-y">
                {savingsPercent > 0 && (
                    <div className="item__savings p-3 text-emerald-600 text-lg text-center">
                        Save{" "}
                        <span className="font-bold text-xl">
                            {savingsPercent}%
                        </span>
                    </div>
                )}

                <div className="item__quality p-3 flex justify-center">
                    <Tooltip content="Quality">
                        <Stars value={product.product.quality} readOnly />
                    </Tooltip>
                </div>

                {isExpired && (
                    <>
                        <div className="item__countdown text-gray-800 p-3 text-center">
                            <div className="text-lg font-semibold">Expired</div>
                            {timeAfterExpired && <div>{timeAfterExpired}</div>}
                        </div>
                    </>
                )}

                {!isExpired &&
                    timeUntilExpired &&
                    timeUntilExpired.length > 0 && (
                        <div>
                            <div className="item__countdown text-red-800 p-3 text-center">
                                <div className="">Expires In</div>
                                <div className="font-bold text-lg flex justify-center items-center gap-2">
                                    {timeUntilExpired.map((segment, i) => {
                                        return <div key={i}>{segment}</div>;
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
            </div>
            <div>
                <Button
                    className="btn-block w-full text-center rounded-none"
                    color="failure"
                    disabled={isExpired}
                >
                    BID NOW
                </Button>
            </div>
        </div>
    );
};

export type ProductsGridProps<I extends ProductsGridItem = ProductsGridItem> = {
    item?: I;
    children?:
        | ReactNode
        | ((props: { products: FullProductItem[] }) => ReactNode);
};
function ProductsGrid({
    item: Item = ProductsItem,
    children,
}: ProductsGridProps) {
    const { products } = useProductsContext();

    const hasChildren = !!children;

    if (!products.length) {
        return (
            <Banner>
                <div className="flex w-full justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
                    <div className="mx-auto flex items-center">
                        <p className="flex gap-3 items-center text-sm font-normal text-gray-500 dark:text-gray-400">
                            <span>
                                <EmptyIcon />
                            </span>
                            <span>No products found. Try another search.</span>
                        </p>
                    </div>
                </div>
            </Banner>
        );
    }

    return (
        <div className="products-grid grid gap-3 w-full">
            {hasChildren &&
                typeof children === "function" &&
                children({ products })}
            {hasChildren && typeof children !== "function" && children}
            {!hasChildren &&
                products.map((product, i) => {
                    return (
                        <Item
                            product={product}
                            key={`${product.id_item}-${i}`}
                        />
                    );
                })}
        </div>
    );
}

function ProductsDesktopSidebar({ children }: { children: ReactNode }) {
    const isDesktop = useIsMinBreakpoint("lg");

    if (!isDesktop) {
        return null;
    }

    return <div className="products-sidebar w-[300px] shrink">{children}</div>;
}

function ProductsEndlessScroller() {
    const [{ y }] = useWindowScroll();
    const ref = useRef<HTMLDivElement>(null);

    const { pagination, setPage } = useProductsContext();

    const { page, pages } = pagination || { page: 1 };

    const [nextPage, setNextPage] = useState(1);

    useEffect(() => {
        /**
         * IF page gets reset, reset next page too
         */
        if (page === 1 && nextPage > 2) {
            setNextPage(1);
        }

        const current = ref.current;
        if (current) {
            const rect = current.getBoundingClientRect();

            // Calculate the distance from the bottom of the viewport
            const distanceToBottom = window.innerHeight - rect.bottom;

            // If the div is within 200px of the viewport's bottom
            if (distanceToBottom >= -200) {
                // Load the next page or do something else

                // if page = 0 then it hasn't loaded yet
                if (page > 0) {
                    /**
                     * If both pages are the same, we can increment
                     * And if the next page is less than pages
                     */
                    if (page === nextPage && page + 1 <= pages) {
                        setNextPage(page + 1);
                        setPage(page + 1);
                    }
                }
            }
        }
    }, [y]);

    return (
        <div ref={ref}>
            {page >= pages && (
                <div className="pt-4">
                    <Banner>
                        <div className="flex w-full justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
                            <div className="mx-auto flex items-center">
                                <p className="flex gap-3 items-center text-sm font-normal text-gray-500 dark:text-gray-400">
                                    <span>
                                        <EmptyIcon />
                                    </span>
                                    <span>
                                        No more products availabe. Check back
                                        soon.
                                    </span>
                                </p>
                            </div>
                        </div>
                    </Banner>
                </div>
            )}
        </div>
    );
}

const ProductsSection = Object.assign(ProductsSectionWrapper, {
    UrlParamsSync,
    Item: ProductsItem,
    Grid: ProductsGrid,
    DesktopSidebar: ProductsDesktopSidebar,
    EndlessScroller: ProductsEndlessScroller,
});

export default ProductsSection;
