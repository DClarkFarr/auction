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
import { Bid } from "../../types/Bid";
import { UserBidStatus } from "../../hooks/useUserBid";
import QuestionIcon from "~icons/ic/baseline-contact-support";
import BigTextTooltip from "../controls/BigTextTooltip";

export type ProductCardProps = {
    isFavorite?: boolean;
    onToggleFavorite?: (idItem: number) => Promise<void> | void;
    product: FullProductItem;
    onClickBid: (product: FullProductItem) => Promise<void> | void;
    onClickClaim: (product: FullProductItem) => Promise<void> | void;
    userBid?: Bid;
    userBidStatus?: UserBidStatus | null;
};
export default function ProductCard({
    isFavorite = false,
    onToggleFavorite,
    product,
    onClickBid,
    onClickClaim,
    userBidStatus,
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

        const rejectsAt =
            userBidStatus === "won" &&
            p.rejectsAt &&
            DateTime.fromISO(p.rejectsAt).isValid &&
            DateTime.fromISO(p.rejectsAt);
        const timeUntilRejects =
            rejectsAt && rejectsAt > now && timeCompareMulti(now, rejectsAt);

        const isInactive =
            p.canceledAt ||
            p.purchasedAt ||
            p.claimedAt ||
            p.rejectedAt ||
            p.status !== "active";

        let borderColor = isExpired
            ? "border-red-600"
            : isInactive
            ? "border-gray-600"
            : "border-purple-600";

        let backgroundColor = isExpired
            ? "bg-red-100"
            : isInactive
            ? "bg-gray-100"
            : "bg-white";

        if (userBidStatus === "won" || userBidStatus === "purchased") {
            borderColor = "border-emerald-600";
            backgroundColor = "bg-emerald-100";
        } else if (userBidStatus === "winning") {
            borderColor = "border-sky-600";
            backgroundColor = "bg-sky-100";
        } else if (userBidStatus === "outbid") {
            borderColor = "border-orange-600";
            backgroundColor = "bg-orange-100";
        }

        return {
            borderColor,
            timeAfterExpired,
            timeUntilExpired,
            isInactive,
            isExpired,
            isDateExpired,
            backgroundColor,
            timeUntilRejects,
            rejectsAt,
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
    }, [product, userBidStatus]);

    const {
        borderColor,
        timeAfterExpired,
        timeUntilExpired,
        isExpired,
        backgroundColor,
        isInactive,
        timeUntilRejects,
        rejectsAt,
        // isDateExpired,
    } = timeData;

    return (
        <div
            className={`item flex flex-col border-2 border-purple-600 shadow-lg ${backgroundColor} ${borderColor}`}
        >
            {userBidStatus === "won" && (
                <div>
                    <div className="item__countdown text-red-800 p-3 text-center bg-purple-600">
                        <div className="text-lg text-white font-semibld">
                            Congratulations, you won!
                        </div>
                    </div>
                </div>
            )}
            {userBidStatus === "winning" && (
                <div>
                    <div className="item__countdown bg-sky-700 p-3 text-center">
                        <div className="text-lg text-white font-semibld">
                            You are the highest bidder
                        </div>
                    </div>
                </div>
            )}
            {(userBidStatus === "outbid" || userBidStatus === "lost") && (
                <div>
                    <div className="item__countdown bg-orange-800 p-3 text-center">
                        <div className="text-lg text-white font-semibld">
                            You've been outbid
                        </div>
                    </div>
                </div>
            )}
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
                            <div className="text-lg font-semibold">
                                Auction Ended
                            </div>
                            {timeAfterExpired && <div>{timeAfterExpired}</div>}
                        </div>
                    </>
                )}

                {!isExpired &&
                    timeUntilExpired &&
                    timeUntilExpired.length > 0 && (
                        <div>
                            <div className="item__countdown text-red-800 p-3 text-center">
                                <div className="">Auction Ends</div>
                                <div className="font-bold text-lg flex justify-center items-center gap-2">
                                    {timeUntilExpired.map((segment, i) => {
                                        return <div key={i}>{segment}</div>;
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                {userBidStatus === "won" && timeUntilRejects && rejectsAt && (
                    <div>
                        <div className="item__countdown text-red-800 p-3 text-center">
                            <BigTextTooltip
                                content={`You have until ${rejectsAt.toLocaleString(
                                    DateTime.DATETIME_MED
                                )} to purchase this item. If not purchased, this item will return to auction.`}
                            >
                                <div className="flex items-center gap-x-2 justify-center">
                                    <span>Time to purchase</span>
                                    <span>
                                        <QuestionIcon />
                                    </span>
                                </div>
                            </BigTextTooltip>
                            <div className="font-bold text-lg flex justify-center items-center gap-2">
                                {timeUntilRejects.map((segment, i) => {
                                    return <div key={i}>{segment}</div>;
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {!isExpired && !isInactive && (
                <div className="mt-auto">
                    <Button
                        className="btn-block w-full text-center rounded-none"
                        color="failure"
                        onClick={() => onClickBid(product)}
                    >
                        BID NOW
                    </Button>
                </div>
            )}
            {userBidStatus === "won" && (
                <div className="mt-auto">
                    <Button
                        className="btn-block w-full text-center rounded-none"
                        color="success"
                        onClick={() => onClickClaim(product)}
                    >
                        CLAIM PURCHASE
                    </Button>
                </div>
            )}
        </div>
    );
}
