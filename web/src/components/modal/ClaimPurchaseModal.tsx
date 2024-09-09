import { Alert, Button, Modal } from "flowbite-react";
import { UseModalConfig } from "../../hooks/useModal";
import { FullProductItem } from "../../types/Product";
import { formatCurrency } from "../../utils/currency";
import React from "react";
import CardDetails from "../stripe/CardDetails";
import useUserStore from "../../stores/useUserStore";
import { AxiosError } from "axios";
import { useCheckoutMutation } from "../../hooks/usePaginatedActiveItemsQuery";

export type ClaimPurchaseModalProps = UseModalConfig & {
    items: FullProductItem[];
};

export default function ClaimPurchaseModal({
    items,
    ...props
}: ClaimPurchaseModalProps) {
    const total = React.useMemo(() => {
        return items.reduce((total, item) => {
            return total + item.bid.amount;
        }, 0);
    }, [items]);

    const { paymentMethod } = useUserStore();

    const handleCheckout = useCheckoutMutation();

    const [isCheckingOut, setIsCheckingOut] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    const onClickCheckout = async () => {
        setIsCheckingOut(true);
        setErrorMessage("");

        try {
            const res = await handleCheckout({
                itemIds: items.map((i) => i.id_item),
            });
            console.log("checkout was", res);
        } catch (err) {
            if (err instanceof AxiosError) {
                setErrorMessage(err.response?.data?.message || err.message);
            } else if (err instanceof Error) {
                console.error("caught error checking out", err);
                setErrorMessage(
                    "Checkout failed. Please try again or contact support"
                );
            }
        } finally {
            setIsCheckingOut(false);
        }
    };

    return (
        <Modal {...props} className="z-[100]">
            <Modal.Header>Checkout</Modal.Header>
            <Modal.Body className="rounded-b-lg">
                <table className="table table-striped w-full mb-4">
                    <thead>
                        <tr className="font-semibold text-left">
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th className="text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => {
                            return (
                                <tr key={item.id_item}>
                                    <td>{item.product.name}</td>
                                    <td className="text-center">1</td>
                                    <td className="text-center">
                                        {formatCurrency(item.bid.amount)}
                                    </td>
                                    <td className="text-right">
                                        {formatCurrency(item.bid.amount)}
                                    </td>
                                </tr>
                            );
                        })}
                        <tr>
                            <td colSpan={4}>
                                <div className="p-3">
                                    <hr />
                                </div>
                            </td>
                        </tr>
                        <tr className="text-gray-900 font-bold">
                            <td colSpan={3}>Total</td>
                            <td className="text-right">
                                {formatCurrency(total)}
                            </td>
                        </tr>
                    </tbody>
                </table>

                <hr className="mb-4" />

                {paymentMethod && (
                    <div className="mb-4">
                        <h3 className="font-semibold text-gray-800 mb-1">
                            Payment Method
                        </h3>
                        <CardDetails paymentMethod={paymentMethod} />
                    </div>
                )}

                {!!errorMessage && (
                    <div className="mb-4">
                        <Alert color="failure">
                            <div className="font-semibold">
                                Error processing payment
                            </div>
                            <div>{errorMessage}</div>
                        </Alert>
                    </div>
                )}

                <div>
                    <Button
                        className="w-full"
                        onClick={onClickCheckout}
                        isProcessing={isCheckingOut}
                        disabled={isCheckingOut || !items.length}
                    >
                        CHECKOUT
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
}
