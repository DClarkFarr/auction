import { Button } from "flowbite-react";
import MiniCart, { MiniCartProps } from "./MiniCart";
import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from "~icons/ic/baseline-arrow-forward";
import CartIcon from "~icons/ic/baseline-shopping-cart";

export type MiniCartPopover = MiniCartProps & {
    top: number;
    right: number;
    show: boolean;
    onClickShow: (show: boolean) => void;
};
export default function MiniCartPopover({
    top,
    right,
    show,
    onClickShow,
    ...props
}: MiniCartPopover) {
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
                                    onClick={() => onClickShow(false)}
                                >
                                    <CloseIcon />
                                </Button>
                            </div>
                            <MiniCart {...props} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {!show && props.items.length > 0 && (
                    <motion.div
                        className="fixed z-[60]"
                        style={{ top: top + "px" }}
                        initial={{ right: "-400px" }}
                        animate={{ right: right + "px" }}
                        exit={{ right: "-400px" }}
                    >
                        <div>
                            <Button
                                size="sm"
                                color="light"
                                onClick={() => onClickShow(true)}
                                className="flex items-center"
                            >
                                <div>
                                    <CartIcon className="h-5" />
                                </div>
                                <div>
                                    <div className="rounded-full bg-gray-600 text-white leading-0 h-5 w-5 text-center">
                                        {props.items.length}
                                    </div>
                                </div>
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
