import { Alert, Spinner } from "flowbite-react";
import usePurchasesQuery from "../../hooks/usePurchasesQuery";
import { DateTime } from "luxon";
import { formatCurrency } from "../../utils/currency";
import { Link } from "react-router-dom";
import ListIcon from "~icons/ic/baseline-list-alt";

export default function PurchaseList() {
    const { purchases, isLoading, isSuccess, error } = usePurchasesQuery();
    return (
        <div className="container">
            <h1 className="text-2xl mb-8">My purchases</h1>

            <table className="table table-striped w-full">
                <thead>
                    <tr>
                        <th className="pl-4 text-left">Date</th>
                        <th className="pl-4 text-left">Items</th>
                        <th className="pl-4 text-left">Total</th>
                        <th className="pl-4 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={4}>
                                <Alert color="info">
                                    <div className="flex items-center">
                                        <span>
                                            <Spinner className="mr-2" />
                                        </span>
                                        <span>Loading...</span>
                                    </div>
                                </Alert>
                            </td>
                        </tr>
                    ) : isSuccess ? (
                        purchases.map((purchase) => (
                            <tr key={purchase.id_purchase}>
                                <td className="pl-4">
                                    {DateTime.fromISO(
                                        purchase.createdAt
                                    ).toLocaleString(DateTime.DATETIME_MED)}
                                </td>
                                <td className="pl-4 text-sm">
                                    {purchase.items.map((item) => (
                                        <div
                                            key={item.id_item}
                                            className="flex justify-between gap-x-2"
                                        >
                                            <div>{item.product.name}</div>
                                            <div>
                                                {formatCurrency(
                                                    item.bid.amount
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </td>
                                <td className="pl-4">
                                    {formatCurrency(purchase.totalAmount)}
                                </td>
                                <td className="pl-4">
                                    <Link
                                        to={`/account/purchases/${purchase.id_purchase}`}
                                        className="text-purple-700 hover:underline flex items-center"
                                    >
                                        <span>
                                            <ListIcon />
                                        </span>
                                        <span className="pl-2">View</span>
                                    </Link>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4}>
                                <Alert color="failure">
                                    Error: {error?.message}
                                </Alert>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
