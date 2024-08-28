import { Alert, Table } from "flowbite-react";
import { PaginatedResults } from "../../types/Paginate";
import { FullCategory } from "../../types/Product";
import {
    PropsWithChildren,
    ReactNode,
    useCallback,
    useMemo,
    useState,
} from "react";
import Pagination from "../controls/Pagination";
import usePaginatedCategoriesQuery from "../../hooks/admin/usePaginatedCategoriesQuery";
import { uploadedAsset } from "../../utils/asset";

type Data = PaginatedResults<FullCategory>;
type ActionsProp =
    | ReactNode
    | ((props: { category: Data["rows"][0] }) => ReactNode);

function CategoryListTable({
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
                    <Table.HeadCell>Image</Table.HeadCell>
                    <Table.HeadCell>Name</Table.HeadCell>
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
                                <Alert color="info">
                                    No categories selected
                                </Alert>
                            </Table.Cell>
                        </Table.Row>
                    )}
                    {pagination?.rows.map((category) => {
                        return (
                            <Table.Row
                                className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                key={category.id_category}
                            >
                                <Table.Cell className="w-[50px]">
                                    <img
                                        className="max-w-[100px]"
                                        src={
                                            category.image?.path
                                                ? uploadedAsset(
                                                      category.image.path
                                                  )
                                                : "https://placehold.co/200x120"
                                        }
                                    />
                                </Table.Cell>
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {category.label}
                                </Table.Cell>

                                <Table.Cell className="text-right">
                                    <div className="float-right">
                                        {typeof actions === "function"
                                            ? actions({ category })
                                            : actions}
                                    </div>
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

function CategoryList({
    children,
    actions,
}: PropsWithChildren<{ actions?: ActionsProp }>) {
    const [page, setPage] = useState(1);

    const query = usePaginatedCategoriesQuery(page);

    const message = useMemo(() => {
        if (query.isLoading) {
            return <Alert color="info">Loading categories...</Alert>;
        }
        if (query.error) {
            return (
                <Alert color="failure">
                    <b>Error loading categories</b> {query.error.message}
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
            <CategoryListTable
                actions={actions}
                message={message}
                pagination={query.pagination}
                onChangePage={onChangePage}
            />
        </>
    );
}

CategoryList.CategoryListTable = CategoryListTable;

export default CategoryList;
