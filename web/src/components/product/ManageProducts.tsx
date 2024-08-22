import { Button, Tabs, Tooltip } from "flowbite-react";
import { useFormModal } from "../../hooks/useModalForm";
import FormModal from "../../components/modal/FormModal";
import CreateProductForm, {
    CreateProductFormState,
} from "../../components/product/CreateProductForm";
import { ReactNode, useMemo, useState } from "react";
import { ProductStatus } from "../../types/Product";
import ProductList from "../../components/product/ProductList";
import useProductsQuery from "../../hooks/admin/useProductsQuery";

import EditIcon from "~icons/ic/round-mode-edit-outline";
import ArchiveIcon from "~icons/ic/baseline-archive";
import { Link } from "react-router-dom";

type ProductTabs = "active" | "archived" | "sold";

const statusMap: Record<ProductTabs, ProductStatus[]> = {
    active: ["active", "inactive", "sold"],
    archived: ["archived"],
    sold: ["sold"],
};

export default function ManageProducts() {
    const [activeTab, setActiveTab] = useState<ProductTabs>("active");

    const { createProduct } = useProductsQuery(statusMap.active);

    const formModal = useFormModal<CreateProductFormState>({
        heading: "Create Product",
        size: "md",
        onAccept: async (data) => {
            await createProduct(data);
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
                                <div className="flex gap-x-3">
                                    <div>
                                        <Tooltip
                                            style="dark"
                                            content="Edit Product"
                                        >
                                            <Button
                                                as={Link}
                                                size="xs"
                                                to={`/admin/products/${product.id_product}`}
                                            >
                                                <EditIcon />
                                            </Button>
                                        </Tooltip>
                                    </div>
                                    <div>
                                        <Tooltip
                                            style="dark"
                                            content="Archive Product"
                                        >
                                            <Button size="xs" color="warning">
                                                <ArchiveIcon />
                                            </Button>
                                        </Tooltip>
                                    </div>
                                </div>
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
                        <ProductList status={statusMap.archived} />
                    </>
                ),
            },
            {
                title: "Sold out",
                key: "sold",
                body: (
                    <>
                        <ProductList status={statusMap.sold} />
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
                    <Button onClick={onShowCreateModal} color="purple">
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
