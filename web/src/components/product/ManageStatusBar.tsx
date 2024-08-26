import { Button } from "flowbite-react";
import { Product, ProductStatus } from "../../types/Product";
import {
    createContext,
    FC,
    PropsWithChildren,
    ReactNode,
    useContext,
    useState,
} from "react";
import BigTextTooltip from "../controls/BigTextTooltip";

import ActivateIcon from "~icons/ic/baseline-remove-red-eye";
import DeactivateIcon from "~icons/ic/baseline-disabled-visible";
import ArchiveIcon from "~icons/ic/baseline-archive";
import UnscheduleIcon from "~icons/ic/baseline-event-busy";
import SoldIcon from "~icons/ic/baseline-production-quantity-limits";

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
    if (!product) {
        return null;
    }

    return (
        <div className="product-status-bar bg-stone-200 rounded-lg md:flex items-center gap-4 p-4">
            <div className="bar">
                <div className="text-xs text-gray-500">Status</div>
                <h2 className="text-xl font-semibold leading-none">
                    {statusMap[product.status]}
                </h2>
            </div>
            <div className="actions ml-auto flex flex-wrap md:flex-nowrap gap-4 items-center">
                <ProductStatusButtons
                    product={product}
                    minify={false}
                    onChangeStatus={onChangeStatus}
                />
            </div>
        </div>
    );
}

type ButtonWrapperBaseProps = {
    onClick: (status: ProductStatus) => Promise<void>;
    disabled: boolean;
    isProcessing: boolean;
};

type ButtonWrapperProps = Omit<ButtonWrapperBaseProps, "onClick"> & {
    content: ReactNode;
    onClick: () => void;
    color: string;
    icon: ReactNode;
    text: string;
};
type ButtonComponentProps = ButtonWrapperProps & {
    size: string;
    minify: boolean;
};

function ButtonWrapper(props: ButtonWrapperProps) {
    const { minify, size } = useContext(ProductStatusContext);

    return <ButtonComponent {...props} size={size} minify={minify} />;
}

function ButtonComponent({
    content,
    color,
    onClick,
    icon,
    text,
    minify,
    ...props
}: ButtonComponentProps) {
    return (
        <BigTextTooltip content={content}>
            <Button color={color} onClick={() => onClick()} {...props}>
                <span className="flex items-center gap-2">
                    {!minify ? <span>{icon}</span> : undefined}
                    <span>{minify ? icon : text}</span>
                </span>
            </Button>
        </BigTextTooltip>
    );
}

const actions: Record<ProductStatus, FC<ButtonWrapperBaseProps>> = {
    active: ({ onClick, ...props }) => (
        <ButtonWrapper
            {...props}
            content={
                <div className="text-left">
                    <div className="font-semibold mb-1">Activate</div>
                    <div>
                        1) Set status active.
                        <br />
                        2) publish the 'Auction batch count' number of items to
                        store and start bidding.
                    </div>
                </div>
            }
            color="success"
            text="Activate"
            icon={<ActivateIcon />}
            onClick={() => onClick("active")}
        />
    ),
    inactive: ({ onClick, ...props }) => (
        <ButtonWrapper
            {...props}
            content={
                <div className="text-left">
                    <div className="font-semibold mb-1">Deactivate</div>
                    <div>
                        1) Set status inactive.
                        <br />
                        2) Cancel any published items and remove them from
                        store.
                    </div>
                </div>
            }
            color="failure"
            text="Deactivate"
            icon={<DeactivateIcon />}
            onClick={() => onClick("inactive")}
        />
    ),
    scheduled: ({ onClick, ...props }) => (
        <ButtonWrapper
            {...props}
            content={
                <div className="text-left">
                    <div className="font-semibold mb-1">Unschedule</div>
                    <div>
                        1) Clears publish schedule.
                        <br />
                        2) Sets status to inactive, if it isn't already.
                    </div>
                </div>
            }
            color="warning"
            text="Unschedule"
            icon={<UnscheduleIcon />}
            onClick={() => onClick("inactive")}
        />
    ),
    sold: ({ onClick, ...props }) => (
        <ButtonWrapper
            {...props}
            content={
                <div className="text-left">
                    <div className="font-semibold mb-1">Move to "Sold Out"</div>
                    <div>
                        1) Mark content as sold out.
                        <br />
                        2) Clear published items, if any.
                        <br />
                        3) Set remaining quantity to 0
                    </div>
                </div>
            }
            color="blue"
            text="Sold Out"
            icon={<SoldIcon />}
            onClick={() => onClick("sold")}
        />
    ),
    archived: ({ onClick, ...props }) => (
        <ButtonWrapper
            {...props}
            content={
                <div className="text-left">
                    <div className="font-semibold mb-1">Archive</div>
                    <div>
                        1) Set product as archived.
                        <br />
                        2) Clear schedule, if set.
                        <br />
                        3) Cancel any active items.
                    </div>
                </div>
            }
            color="dark"
            text="Archive"
            icon={<ArchiveIcon />}
            onClick={() => onClick("archived")}
        />
    ),
};
type ProductStatusContext = {
    size: string;
    minify: boolean;
};
const ProductStatusContext = createContext<ProductStatusContext>(
    {} as ProductStatusContext
);

export function ProductStatusProvider({
    children,
    minify = true,
}: PropsWithChildren<{ minify?: boolean }>) {
    const size = minify ? "xs" : "sm";

    return (
        <ProductStatusContext.Provider value={{ minify, size }}>
            <div
                className={`flex ${
                    minify ? "" : "flex-wrap md:flex-nowrap"
                } gap-2 items-center`}
            >
                {children}
            </div>
        </ProductStatusContext.Provider>
    );
}

export function ProductStatusButtons({
    minify = false,
    product,
    onChangeStatus,
}: {
    minify?: boolean;
    product: Product;
    onChangeStatus: (idProduct: number, status: ProductStatus) => Promise<void>;
}) {
    const [updatingStatus, setUpdatingStatus] = useState<ProductStatus | null>(
        null
    );

    const handleClickWrapped = async (status: ProductStatus) => {
        setUpdatingStatus(status);
        try {
            await onChangeStatus(product.id_product, status);
        } finally {
            setUpdatingStatus(null);
        }
    };

    return (
        <ProductStatusProvider minify={minify}>
            {actionMap[product.status].map((action) => {
                const B = actions[action];
                return (
                    <B
                        key={action}
                        disabled={!!updatingStatus}
                        isProcessing={action === updatingStatus}
                        onClick={handleClickWrapped}
                    />
                );
            })}
            {product.scheduledFor &&
                ["active", "inactive"].includes(product.status) && (
                    <actions.scheduled
                        disabled={!!updatingStatus}
                        isProcessing={product.status === updatingStatus}
                        onClick={handleClickWrapped}
                    />
                )}
        </ProductStatusProvider>
    );
}
