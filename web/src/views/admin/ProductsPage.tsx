import { Button } from "flowbite-react";

const onShowCreateModal = () => {};

export default function ProductsPage() {
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
        </div>
    );
}
