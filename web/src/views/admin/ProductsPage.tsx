import { Button } from "flowbite-react";
import { useFormModal } from "../../hooks/useModalForm";
import FormModal from "../../components/modal/FormModal";
import CreateProductForm, {
    CreateProductFormState,
} from "../../components/product/CreateProductForm";

export default function ProductsPage() {
    const formModal = useFormModal<CreateProductFormState>({
        heading: "Create Product",
        size: "md",
        onAccept: async () => {
            console.log("launch!");
        },
    });

    const onShowCreateModal = () => {
        formModal.setOpenModal(true);
    };

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
            TODO: Product tabs here!
        </div>
    );
}
