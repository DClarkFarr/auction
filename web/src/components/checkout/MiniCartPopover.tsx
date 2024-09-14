import { Button, Tooltip } from "flowbite-react";
import MiniCart, { MiniCartProps } from "./MiniCart";
import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from "~icons/ic/baseline-arrow-forward";
import CartIcon from "~icons/ic/baseline-shopping-cart";

export type MiniCartPopover = MiniCartProps & {
    top: number;
    right: number;
    show: boolean;
    numWinningItems: number;
    numWonItems: number;
    numOutbidItems: number;
    onClickHide: () => void;
    onClickShow: (clicked: "winning" | "won" | "outbit" | "cart") => void;
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
    ...props
}: MiniCartPopover) {
    const hasContent =
        numWinningItems > 0 ||
        numWonItems > 0 ||
        numOutbidItems > 0 ||
        items.length > 0;

    return (
        <>
            <AnimatePresence>
                {show && (
                    <motion.div
                        className="fixed z-[60]"
                        style={{ top: top + "px" }}
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
                        className="fixed z-[60]"
                        style={{ top: top + "px" }}
                        initial={{ right: "-400px" }}
                        animate={{ right: right + "px" }}
                        exit={{ right: "-400px" }}
                    >
                        <div className="flex gap-2 items-center">
                            <CartButtonItem
                                icon={CartIcon}
                                count={items.length}
                                tooltip="# Cart Items"
                                onClick={() => onClickShow("cart")}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

function CartButtonItem({
    tooltip,
    icon: Icon,
    count,
    onClick,
}: {
    icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
    onClick: () => void;
    tooltip: string;
    count: number;
}) {
    if (!count) {
        return null;
    }

    return (
        <div>
            <Tooltip content={tooltip}>
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
                        <div className="rounded-full bg-gray-600 text-white leading-0 h-5 w-5 text-center">
                            {count}
                        </div>
                    </div>
                </Button>
            </Tooltip>
        </div>
    );
}
