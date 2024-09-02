import { useWindowScroll } from "@uidotdev/usehooks";
import { Banner } from "flowbite-react";
import React from "react";
import EmptyIcon from "~icons/ic/baseline-help";
import { useProductsContext } from "../../../providers/useProductsContext";

export default function ProductsEndlessScroller() {
    const [{ y }] = useWindowScroll();
    const ref = React.useRef<HTMLDivElement>(null);

    const { pagination, setPage, products, isLoading } = useProductsContext();

    const { page, pages } = pagination || { page: 1 };

    const [nextPage, setNextPage] = React.useState(1);

    React.useEffect(() => {
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
            {page >= pages && products.length > 1 && !isLoading && (
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
