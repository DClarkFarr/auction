import { Button } from "flowbite-react";
import { Product, ProductStatus } from "../../types/Product";
import { ReactNode, useState } from "react";
import BigTextTooltip from "../controls/BigTextTooltip";

const actions: Record<
    ProductStatus,
    (props: {
        onClick: (status: ProductStatus) => Promise<void>;
        disabled: boolean;
        isProcessing: boolean;
    }) => ReactNode
> = {
    active: ({ onClick, ...props }) => (
        <BigTextTooltip content="1) Set status active, 2) publish the 'Auction batch count' number of items to store and start bidding.>">
            <Button
                size="sm"
                color="success"
                {...props}
                onClick={() => onClick("active")}
            >
                Activate
            </Button>
        </BigTextTooltip>
    ),
    inactive: ({ onClick, ...props }) => (
        <BigTextTooltip content="1) Set status inactive. 2) Cancel any published items and remove them from store.">
            <Button
                size="sm"
                color="failure"
                {...props}
                onClick={() => onClick("inactive")}
            >
                Deactivate
            </Button>
        </BigTextTooltip>
    ),
    scheduled: ({ onClick, ...props }) => (
        <BigTextTooltip content="1) Clears publish schedule. 2) Sets status to inactive, if it isn't already.">
            <Button
                size="sm"
                color="warning"
                {...props}
                onClick={() => onClick("inactive")}
            >
                Unschedule
            </Button>
        </BigTextTooltip>
    ),
    sold: ({ onClick, ...props }) => (
        <BigTextTooltip content="1) Mark content as sold out. 2) Clear published items, if any. ">
            <Button
                size="sm"
                color="blue"
                {...props}
                onClick={() => onClick("sold")}
            >
                Sold Out
            </Button>
        </BigTextTooltip>
    ),
    archived: ({ onClick, ...props }) => (
        <BigTextTooltip content="1) Set product as archived. 2) Clear schedule, if set. 3) Cancel any active items.">
            <Button
                size="sm"
                color="dark"
                {...props}
                onClick={() => onClick("archived")}
            >
                Archive
            </Button>
        </BigTextTooltip>
    ),
};

const statusMap: Record<ProductStatus, string> = {
    active: "Active",
    inactive: "Inactive",
    scheduled: "Clear Schedule",
    archived: "Archived",
    sold: "Sold Out",
};

const actionMap: Record<ProductStatus, ProductStatus[]> = {
    active: ["inactive", "archived", "sold"],
    inactive: ["active", "archived", "sold"],
    archived: ["inactive"],
    sold: ["inactive"],
    scheduled: [],
};

export default function ManageStatusBar<P extends Product>({
    product,
    onChangeStatus,
}: {
    onChangeStatus: (idProduct: number, status: ProductStatus) => Promise<void>;
    product: P | null;
}) {
    const [updatingStatus, setUpdatingStatus] = useState<ProductStatus | null>(
        null
    );

    if (!product) {
        return null;
    }

    const handleClicWrapped = async (status: ProductStatus) => {
        setUpdatingStatus(status);
        try {
            await onChangeStatus(product.id_product, status);
        } finally {
            setUpdatingStatus(null);
        }
    };

    return (
        <div className="product-status-bar bg-stone-200 rounded-lg md:flex items-center gap-4 p-4">
            <div className="bar">
                <div className="text-xs text-gray-500">Status</div>
                <h2 className="text-xl font-semibold leading-none">
                    {statusMap[product.status]}
                </h2>
            </div>
            <div className="actions ml-auto flex flex-wrap md:flex-nowrap gap-4 items-center">
                {actionMap[product.status].map((action) => {
                    const B = actions[action];
                    return (
                        <B
                            key={action}
                            disabled={!!updatingStatus}
                            isProcessing={action === updatingStatus}
                            onClick={handleClicWrapped}
                        />
                    );
                })}
            </div>
        </div>
    );
}
