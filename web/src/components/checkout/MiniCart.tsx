import { Button, Card } from "flowbite-react";
import { FullProductItem } from "../../types/Product";
import { formatCurrency } from "../../utils/currency";
import React from "react";

export type MiniCartProps = {
    onClickCheckout: () => Promise<void>;
    items: FullProductItem[];
};

export default function MiniCart({ onClickCheckout, items }: MiniCartProps) {
    const total = React.useMemo(() => {
        return items.reduce((acc, item) => {
            return acc + (item.bid.amount || 0);
        }, 0);
    }, [items]);

    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleCheckout = async () => {
        setIsSubmitting(true);
        try {
            await onClickCheckout();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="max-w-sm min-w-[250px]">
            <div className="card__heading text-lg font-semibold border-b border-gray-300 text-gray-800">
                Cart
            </div>
            <div className="flex flex-col divide-y divide-y-gray-300 text-gray-500 mb-2">
                {items.map((item) => {
                    return (
                        <div className="flex gap-x-2 py-1" key={item.id_item}>
                            <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                                {item.product.name}
                            </div>
                            <div className="ml-auto">
                                {formatCurrency(item.bid.amount)}
                            </div>
                        </div>
                    );
                })}
            </div>
            <hr />
            <div className="flex font-semibold text-gray-700">
                <div>Total:</div>
                <div className="ml-auto">{formatCurrency(total)}</div>
            </div>
            <Button
                onClick={handleCheckout}
                isProcessing={isSubmitting}
                disabled={!items.length || isSubmitting}
            >
                Checkout
            </Button>
        </Card>
    );
}
