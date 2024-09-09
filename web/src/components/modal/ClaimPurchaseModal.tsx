import { Modal } from "flowbite-react";
import { UseModalConfig } from "../../hooks/useModal";
import { FullProductItem } from "../../types/Product";
import { formatCurrency } from "../../utils/currency";
import React from "react";

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
    return (
        <Modal {...props}>
            <Modal.Header>Purchase Item</Modal.Header>
            <Modal.Body className="p-0 rounded-b-lg">
                <table className="table table-striped">
                    <thead>
                        <tr className="font-semibold text-left">
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => {
                            return (
                                <tr key={item.id_item}>
                                    <td>{item.product.name}</td>
                                    <td>1</td>
                                    <td>{formatCurrency(item.bid.amount)}</td>
                                    <td>{formatCurrency(item.bid.amount)}</td>
                                </tr>
                            );
                        })}
                        <tr>
                            <td colSpan={4}>
                                <hr />
                            </td>
                        </tr>
                        <tr className="text-gray-900 font-bold">
                            <td colSpan={3}>Total</td>
                            <td>{formatCurrency(total)}</td>
                        </tr>
                    </tbody>
                </table>
            </Modal.Body>
        </Modal>
    );
}
