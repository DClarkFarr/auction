import { Button, Carousel, Tooltip } from "flowbite-react";
import Stars from "../controls/Stars";
import { formatCurrency } from "../../utils/currency";
import { uploadedAsset } from "../../utils/asset";

import IconLiked from "~icons/ic/baseline-favorite";
import IconUnliked from "~icons/ic/baseline-favorite-border";
import { DateTime } from "luxon";
import { timeCompare, timeCompareMulti } from "../../utils/time";
import React from "react";
import { FullProductItem } from "../../types/Product";

export type ProductCardProps = {
    isFavorite?: boolean;
    onToggleFavorite?: (idItem: number) => Promise<void> | void;
    product: FullProductItem;
    onClickBid: (product: FullProductItem) => Promise<void> | void;
};
export default function ProductCard({
    isFavorite = false,
    onToggleFavorite,
    product,
    onClickBid,
}: ProductCardProps) {
    const retailPrice = product.product.priceRetail;
    const currentPrice = product.bid
        ? product.bid.amount
        : product.product.priceInitial;

    const canToggleFavorite = typeof onToggleFavorite === "function";

    const savingsPercent = parseFloat(
        ((1 - currentPrice / retailPrice) * 100).toFixed(1)
    );

    const calulateTimeData = (p: ProductCardProps["product"]) => {
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
            p.canceledAt ||
            p.purchasedAt ||
            p.claimedAt ||
            p.rejectedAt ||
            p.status !== "active";

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

    const [timeData, setTimeData] = React.useState(calulateTimeData(product));

    React.useEffect(() => {
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
                    {canToggleFavorite && (
                        <Tooltip
                            className="whitespace-nowrap"
                            content={
                                isFavorite ? "Remove favorite" : "Add Favorite"
                            }
                        >
                            <Button
                                theme={{
                                    color: {
                                        pink: "border border-transparent bg-fuchsia-700 text-white focus:ring-4 focus:ring-fuchsia-300 enabled:hover:bg-fuchsia-800 dark:bg-fuchsia-600 dark:focus:ring-fuchsia-900 dark:enabled:hover:bg-fuchsia-700",
                                    },
                                }}
                                size="sm"
                                color={isFavorite ? "pink" : "light"}
                                onClick={() =>
                                    onToggleFavorite(product.id_item)
                                }
                            >
                                {isFavorite ? <IconLiked /> : <IconUnliked />}
                            </Button>
                        </Tooltip>
                    )}
                    {!canToggleFavorite && (
                        <div
                            className={`rounded leading-none py-2 px-3 ${
                                isFavorite ? `bg-[#a21caf]` : "bg-gray-100"
                            }`}
                        >
                            {isFavorite ? <IconLiked /> : <IconUnliked />}
                        </div>
                    )}
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
                    onClick={() => onClickBid(product)}
                >
                    BID NOW
                </Button>
            </div>
        </div>
    );
}
