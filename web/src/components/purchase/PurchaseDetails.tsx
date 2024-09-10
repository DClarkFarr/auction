import { Alert, Breadcrumb, Spinner } from "flowbite-react";
import { FullPurchase } from "../../types/Purchase";
import { Link } from "react-router-dom";
import { DateTime } from "luxon";
import { formatCurrency } from "../../utils/currency";

export default function TransactionDetails({
    purchase,
    isLoading,
    error,
}: {
    purchase: FullPurchase | null;
    isLoading: boolean;
    error?: Error | null;
}) {
    return (
        <div className="container">
            <Breadcrumb aria-label="Default breadcrumb example">
                <Breadcrumb.Item>
                    <Link
                        className="text-purple-700 hover:underline"
                        to="/account/purchases"
                    >
                        Purchase History
                    </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Transaction Details</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="text-2xl font-semibold mb-8">Purchase Receipt</h1>

            {isLoading && (
                <Alert color="info">
                    <div className="flex items-center gap-x-2 text-gray-500">
                        <div>
                            <Spinner />
                        </div>
                        <div>Loading transaction details ...</div>
                    </div>
                </Alert>
            )}
            {!!error && <Alert color="failure">{error.message}</Alert>}

            {purchase && (
                <div className="p-6 bg-gray-100 rounded-lg">
                    <div className="lg:flex">
                        <div className="lg:w-1/2">
                            <h2 className="text-xl">
                                <span className="text-gray-500">
                                    Transaction ID
                                </span>
                                <span className="pl-2 text-gray-700 text-semibold">
                                    #{purchase.id_purchase}
                                </span>
                            </h2>
                        </div>
                        <div className="lg:w-1/2 text-right text-gray-500">
                            <div>Purchase Date</div>
                            <div className="font-bold text-gray-700">
                                {DateTime.fromISO(
                                    purchase.createdAt
                                ).toLocaleString(DateTime.DATETIME_MED)}
                            </div>
                        </div>
                    </div>

                    <h3 className="text-xl font-semibold mt-4 mb-2">
                        User Information
                    </h3>

                    <div className="lg:flex gap-x-5">
                        <div className="lg:w-[150px] mb-1">
                            <div className="text-gray-500">Name</div>
                        </div>
                        <div className="">
                            <div className="text-gray-700 font-semibold">
                                {purchase.user.name}
                            </div>
                        </div>
                    </div>
                    <div className="lg:flex gap-x-5">
                        <div className="lg:w-[150px] mb-1">
                            <div className="text-gray-500">Email</div>
                        </div>
                        <div className="">
                            <div className="text-gray-700 font-semibold">
                                {purchase.user.email}
                            </div>
                        </div>
                    </div>

                    <h3 className="text-xl font-semibold mt-4 mb-2">Items</h3>
                    <ul>
                        {purchase.items.map((item, i) => {
                            const bg = i % 2 === 0 ? "bg-gray-200" : "bg-white";
                            return (
                                <table className="table table-striped w-full">
                                    <thead>
                                        <tr>
                                            <th className="pb-2 text-left">
                                                Product
                                            </th>
                                            <th className="pl-4 pb-2 text-center">
                                                Quantity
                                            </th>
                                            <th className="pl-4 pb-2 text-left text-right">
                                                Amount
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr key={item.id_item}>
                                            <td className={`${bg} pl-4 py-2 `}>
                                                {item.product.name}
                                            </td>
                                            <td
                                                className={`${bg} py-2 pl-4 text-center`}
                                            >
                                                1
                                            </td>
                                            <td
                                                className={`${bg} py-2 pl-4 text-right`}
                                            >
                                                {formatCurrency(
                                                    item.bid.amount
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            );
                        })}
                    </ul>
                    <hr className="mt-4 border-b border-b-gray-700" />
                    <div className="flex justify-between items-center">
                        <div className="text-lg font-semibold mt-4">Total</div>
                        <div className="text-lg font-semibold mt-4">
                            {formatCurrency(purchase.totalAmount)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
