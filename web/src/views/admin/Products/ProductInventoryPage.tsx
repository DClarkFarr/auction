import React from "react";
import AdminService from "../../../services/AdminService";
import { Link, useParams } from "react-router-dom";
import useProductQuery from "../../../hooks/admin/useProductQuery";
import { DateTime } from "luxon";
import { formatCurrency } from "../../../utils/currency";

export default function ProductInventoryPage() {
    const [items, setItems] = React.useState<
        Awaited<ReturnType<typeof AdminService.getProductInventory>>
    >([]);

    const formatDate = (s: string) =>
        DateTime.fromISO(s).toLocaleString(DateTime.DATETIME_SHORT);

    const params = useParams();

    const productId = Number(params.id);

    const { product } = useProductQuery(productId);

    React.useEffect(() => {
        const load = async () => {
            if (productId) {
                setItems(await AdminService.getProductInventory(productId));
            }
        };
        load();
    }, [productId]);

    return (
        <div className="product-inventory">
            <h2 className="text-2xl mb-8">
                <div className="text-base">
                    <Link
                        to="/admin/products"
                        className="text-purple-700 hover:underline"
                    >
                        Back to Products
                    </Link>
                </div>
                <span>Product Inventory</span>
                {product && (
                    <span className="text-lg text-gray-500 pl-4">
                        {product.name}
                    </span>
                )}
            </h2>
            <table className="table table-auto table-striped">
                <thead>
                    <tr>
                        <th className="text-left p-4 pl-8">ID</th>
                        <th className="text-left p-4 pl-8">Created</th>
                        <th className="text-left p-4 pl-8">Bids</th>
                        <th className="text-left p-4 pl-8">Last Event</th>
                        <th className="text-left p-4 pl-8">Purchased</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => {
                        const status = item.status;
                        const statusDate = item[
                            `${status}At` as keyof typeof item
                        ] as string;

                        return (
                            <tr key={item.id_item}>
                                <td className="text-left border-b border-slate-100 p-2 pl-4 text-slate-600 dark:text-slate-400">
                                    {item.id_item}
                                </td>
                                <td className="text-left border-b border-slate-100 p-2 pl-4 text-slate-600 dark:text-slate-400">
                                    {formatDate(item.createdAt)}
                                </td>
                                <td className="text-left border-b border-slate-100 p-2 pl-4 text-slate-600 dark:text-slate-400">
                                    <div>
                                        Total bids: {item.bids?.length || 0}
                                    </div>
                                    {item.bids?.length > 0 && (
                                        <div>
                                            Highest Price:{" "}
                                            {formatCurrency(
                                                Math.max(
                                                    ...item.bids.map(
                                                        (b) => b.amount
                                                    )
                                                )
                                            )}{" "}
                                        </div>
                                    )}
                                </td>
                                <td className="text-left border-b border-slate-100 p-4 pl-8 text-slate-600">
                                    <div>{status}</div>
                                    {statusDate && (
                                        <div>{formatDate(statusDate)}</div>
                                    )}
                                </td>
                                <td className="text-left border-b border-slate-100 p-4 pl-8 text-slate-600">
                                    {item.id_purchase ? "Yes" : "No"}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
