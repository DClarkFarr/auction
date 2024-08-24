import { Alert, Table } from "flowbite-react";
import { PaginatedResults } from "../../types/Paginate";
import { Product, ProductStatus, WithCategory } from "../../types/Product";
import {
    PropsWithChildren,
    ReactNode,
    useCallback,
    useMemo,
    useState,
} from "react";
import { formatCurrency } from "../../utils/currency";
import { DateTime } from "luxon";
import Pagination from "../controls/Pagination";
import useProductsQuery from "../../hooks/admin/useProductsQuery";

type Data = PaginatedResults<WithCategory<Product>>;
type ActionsProp =
    | ReactNode
    | ((props: { product: Data["rows"][0] }) => ReactNode);

function ProductListTable({
    onChangePage,
    message,
    pagination,
    actions,
}: {
    onChangePage: (page: number) => Promise<void>;
    message?: ReactNode;
    actions?: ActionsProp;
    pagination?: Data;
}) {
    return (
        <div className="overflow-x-auto">
            {pagination && (
                <div className="md:flex w-full justify-end text-xs font-gray-500">
                    <div>
                        Showing {pagination.page} of {pagination.pages}
                    </div>
                </div>
            )}
            <Table hoverable>
                <Table.Head>
                    <Table.HeadCell>Name</Table.HeadCell>
                    <Table.HeadCell>Quantity</Table.HeadCell>
                    <Table.HeadCell>Price</Table.HeadCell>
                    <Table.HeadCell>Status</Table.HeadCell>
                    <Table.HeadCell>Created</Table.HeadCell>
                    {actions && (
                        <Table.HeadCell>
                            <span className="sr-only">Edit</span>
                        </Table.HeadCell>
                    )}
                </Table.Head>
                <Table.Body className="divide-y">
                    {message && (
                        <Table.Row>
                            <Table.Cell colSpan={6}>{message}</Table.Cell>
                        </Table.Row>
                    )}
                    {!pagination?.rows.length && !message && (
                        <Table.Row>
                            <Table.Cell colSpan={6}>
                                <Alert color="info">No prodcuts selected</Alert>
                            </Table.Cell>
                        </Table.Row>
                    )}
                    {pagination?.rows.map((product) => {
                        return (
                            <Table.Row
                                className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                key={product.id_product}
                            >
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {product.name}
                                </Table.Cell>
                                <Table.Cell>
                                    {product.remainingQuantity}
                                </Table.Cell>
                                <Table.Cell>
                                    {formatCurrency(product.priceRetail)}
                                </Table.Cell>
                                <Table.Cell>{product.status}</Table.Cell>
                                <Table.Cell>
                                    {DateTime.fromISO(
                                        product.createdAt
                                    ).toLocaleString(DateTime.DATE_MED)}
                                </Table.Cell>
                                <Table.Cell>
                                    {typeof actions === "function"
                                        ? actions({ product })
                                        : actions}
                                </Table.Cell>
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table>
            {pagination && (
                <Pagination {...pagination} onClick={onChangePage} />
            )}
        </div>
    );
}

function ProductList({
    status,
    children,
    actions,
}: PropsWithChildren<{ status: ProductStatus[]; actions?: ActionsProp }>) {
    const [page, setPage] = useState(1);

    const query = useProductsQuery(status, page);

    const message = useMemo(() => {
        if (query.isLoading) {
            return <Alert color="info">Loading Products...</Alert>;
        }
        if (query.error) {
            return (
                <Alert color="failure">
                    <b>Error loading products</b> {query.error.message}
                </Alert>
            );
        }

        return null;
    }, [query.isLoading, query.error]);

    const onChangePage = useCallback(async (page: number) => {
        setPage(page);
    }, []);

    return (
        <>
            {children}
            <ProductListTable
                actions={actions}
                message={message}
                pagination={query.pagination}
                onChangePage={onChangePage}
            />
        </>
    );
}

ProductList.ProductListTable = ProductListTable;

export default ProductList;
