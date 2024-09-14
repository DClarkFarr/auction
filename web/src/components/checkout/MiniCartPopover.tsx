import { Button, TooltipProps } from "flowbite-react";
import MiniCart, { MiniCartProps } from "./MiniCart";
import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from "~icons/ic/baseline-arrow-forward";
import CartIcon from "~icons/ic/baseline-shopping-cart";
import OutbidIcon from "~icons/ic/outline-warning";
import WonIcon from "~icons/heroicons/trophy-16-solid";
import WinningIcon from "~icons/ic/baseline-attach-money";
import React from "react";
import BigTextTooltip from "../controls/BigTextTooltip";

export type MiniCartPopover = MiniCartProps & {
    top: number;
    right: number;
    show: boolean;
    numWinningItems: number;
    numWonItems: number;
    numOutbidItems: number;
    isWinningPage: boolean;
    isAllPage: boolean;
    onClickHide: () => void;
    onClickShow: (clicked: "winning" | "won" | "outbid" | "cart") => void;
};
export default function MiniCartPopover({
    top,
    right,
    show,
    onClickShow,
    onClickHide,
    items,
    numWinningItems,
    numWonItems,
    numOutbidItems,
    isWinningPage,
    isAllPage,
    ...props
}: MiniCartPopover) {
    const hasContent =
        (numWinningItems > 0 && !isWinningPage) ||
        (numWonItems > 0 && !isWinningPage) ||
        (numOutbidItems > 0 && !isAllPage) ||
        items.length > 0;

    const maxTop = 60;

    const [topAdjustment, setTopAdjustment] = React.useState(0);
    const [tooltipPlacement] =
        React.useState<TooltipProps["placement"]>("bottom");

    React.useEffect(() => {
        const handler = () => {
            const scrollTop = window.scrollY;
            if (scrollTop < maxTop) {
                setTopAdjustment(maxTop - scrollTop);
            }
        };
        window.addEventListener("scroll", handler);

        handler();

        return () => {
            window.removeEventListener("scroll", handler);
        };
    }, [top]);

    const topPosition = top + topAdjustment;

    return (
        <>
            <AnimatePresence>
                {show && (
                    <motion.div
                        className="fixed flex-inline z-[60]"
                        style={{ top: topPosition + "px" }}
                        initial={{ right: "-400px" }}
                        animate={{ right: right + "px" }}
                        exit={{ right: "-400px" }}
                    >
                        <div className="relative">
                            <div className="absolute top-3 right-3">
                                <Button
                                    size="sm"
                                    color="light"
                                    onClick={() => onClickHide()}
                                >
                                    <CloseIcon />
                                </Button>
                            </div>
                            <MiniCart {...props} items={items} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {!show && hasContent && (
                    <motion.div
                        className="fixed flex-inline z-[60]"
                        style={{ top: topPosition + "px" }}
                        initial={{ right: "-400px" }}
                        animate={{ right: right + "px" }}
                        exit={{ right: "-400px" }}
                    >
                        <div className="flex gap-2 items-center">
                            <CartButtonItem
                                tooltipPlacement={tooltipPlacement}
                                show={!isAllPage}
                                icon={OutbidIcon}
                                count={numOutbidItems}
                                badgeColor="bg-amber-600"
                                tooltip="# Outbid Items"
                                onClick={() => onClickShow("outbid")}
                            />

                            <CartButtonItem
                                tooltipPlacement={tooltipPlacement}
                                icon={CartIcon}
                                count={items.length}
                                tooltip="# Cart Items"
                                onClick={() => onClickShow("cart")}
                            />
                            <CartButtonItem
                                tooltipPlacement={tooltipPlacement}
                                show={!isWinningPage}
                                icon={WinningIcon}
                                count={numWinningItems}
                                tooltip="# Winning Items"
                                badgeColor="bg-sky-600"
                                onClick={() => onClickShow("winning")}
                            />
                            <CartButtonItem
                                tooltipPlacement={tooltipPlacement}
                                show={!isWinningPage}
                                icon={WonIcon}
                                count={numWonItems}
                                tooltip="# Won Items"
                                badgeColor="bg-emerald-600"
                                onClick={() => onClickShow("won")}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

function CartButtonItem({
    tooltipPlacement,
    tooltip,
    icon: Icon,
    count,
    show = true,
    badgeColor = "bg-gray-600",
    onClick,
}: {
    tooltipPlacement: TooltipProps["placement"];
    icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
    onClick: () => void;
    tooltip: string;
    count: number;
    show?: boolean;
    badgeColor?: string;
}) {
    return (
        <>
            {count > 0 && show && (
                <BigTextTooltip
                    className="text-center"
                    placement={tooltipPlacement}
                    content={tooltip}
                >
                    <Button
                        size="sm"
                        color="light"
                        onClick={() => onClick()}
                        className="flex items-center"
                    >
                        <div>
                            <Icon className="h-5" />
                        </div>
                        <div>
                            <div
                                className={`rounded-full text-white leading-0 h-5 w-5 text-center ${badgeColor}`}
                            >
                                {count}
                            </div>
                        </div>
                    </Button>
                </BigTextTooltip>
            )}
        </>
    );
}
