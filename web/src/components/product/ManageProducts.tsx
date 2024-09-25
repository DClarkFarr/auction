import { Button, Tabs, Tooltip } from "flowbite-react";
import { useFormModal } from "../../hooks/useModalForm";
import FormModal from "../../components/modal/FormModal";
import CreateProductForm, {
    CreateProductFormState,
} from "../../components/product/CreateProductForm";
import { ReactNode, useMemo, useState } from "react";
import { Product, ProductStatus } from "../../types/Product";
import ProductList from "../../components/product/ProductList";
import useProductsQuery from "../../hooks/admin/useProductsQuery";

import EditIcon from "~icons/ic/round-mode-edit-outline";
import ViewIcon from "~icons/ic/round-remove-red-eye";
import { Link, useNavigate } from "react-router-dom";
import { ProductStatusButtons } from "./ManageStatusBar";
import { useProductStatus } from "../../hooks/admin/useProductQuery";
import InventoryIcon from "~icons/ic/baseline-production-quantity-limits";

type ProductTabs = "active" | "archived" | "sold";

const statusMap: Record<ProductTabs, ProductStatus[]> = {
    active: ["active", "inactive"],
    archived: ["archived"],
    sold: ["sold"],
};

export default function ManageProducts() {
    const [activeTab, setActiveTab] = useState<ProductTabs>("active");
    const navigate = useNavigate();

    const { createProduct } = useProductsQuery(statusMap.active);

    const { setProductStatus: onChangeStatus } = useProductStatus();

    const formModal = useFormModal<CreateProductFormState>({
        heading: "Create Product",
        size: "md",
        onAccept: async (data) => {
            const p = await createProduct(data);
            navigate(`/admin/products/${p.id_product}`);
        },
    });

    const onShowCreateModal = () => {
        formModal.setOpenModal(true);
    };

    const tabs = useMemo<
        {
            title: string;
            key: ProductTabs;
            body: ReactNode;
        }[]
    >(() => {
        return [
            {
                title: "Active",
                key: "active",
                body: (
                    <>
                        <ProductList
                            status={statusMap.active}
                            actions={({ product }) => (
                                <ProductActions
                                    product={product}
                                    onChangeStatus={onChangeStatus}
                                    edit
                                />
                            )}
                        />
                    </>
                ),
            },
            {
                title: "Archived",
                key: "archived",
                status: ["archived"],
                body: (
                    <>
                        <ProductList
                            status={statusMap.archived}
                            actions={({ product }) => (
                                <ProductActions
                                    product={product}
                                    onChangeStatus={onChangeStatus}
                                />
                            )}
                        />
                    </>
                ),
            },
            {
                title: "Sold out",
                key: "sold",
                body: (
                    <>
                        <ProductList
                            status={statusMap.sold}
                            actions={({ product }) => (
                                <ProductActions
                                    product={product}
                                    onChangeStatus={onChangeStatus}
                                />
                            )}
                        />
                    </>
                ),
            },
        ];
    }, []);

    return (
        <div>
            <div className="md:flex flex-col md:flex-row">
                <div>
                    <h1 className="mb-8 text-2xl">
                        Products{" "}
                        <span className="pl-2 text-gray-500 text-lg">
                            before auction
                        </span>
                    </h1>
                </div>
                <div className="md:ml-auto">
                    <Button onClick={onShowCreateModal} color="cyan">
                        Create Product
                    </Button>
                </div>
            </div>
            <FormModal {...formModal} form={CreateProductForm} />

            <Tabs aria-label="Product Tabs" variant="default">
                {tabs.map((tab) => {
                    return (
                        <Tabs.Item
                            key={tab.key}
                            active={tab.key === activeTab}
                            title={tab.title}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.body}
                        </Tabs.Item>
                    );
                })}
            </Tabs>
        </div>
    );
}

function ProductActions({
    product,
    onChangeStatus,
    edit = false,
}: {
    onChangeStatus: (idProduct: number, status: ProductStatus) => Promise<void>;
    edit?: boolean;
    product: Product;
}) {
    return (
        <div className="flex gap-x-3">
            <div>
                <Button
                    color="dark"
                    as={Link}
                    size="xs"
                    to={`/admin/products/${product.id_product}/inventory`}
                >
                    <InventoryIcon />
                </Button>
            </div>
            <div>
                {edit && (
                    <Tooltip style="dark" content="Edit Product">
                        <Button
                            as={Link}
                            size="xs"
                            to={`/admin/products/${product.id_product}`}
                        >
                            <EditIcon />
                        </Button>
                    </Tooltip>
                )}
                {!edit && (
                    <Tooltip style="dark" content="View Product">
                        <Button
                            as={Link}
                            size="xs"
                            to={`/admin/products/${product.id_product}?mode=view`}
                        >
                            <ViewIcon />
                        </Button>
                    </Tooltip>
                )}
            </div>
            <div>|</div>
            <div>
                <ProductStatusButtons
                    minify
                    product={product}
                    onChangeStatus={onChangeStatus}
                />
            </div>
        </div>
    );
}
