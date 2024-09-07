import { Modal } from "flowbite-react";
import ProductBid from "../product/ProductBid";

type ProductBidModalProps = { onClose?: () => void };

export default function ProductBidModal(props: ProductBidModalProps) {
    return (
        <Modal {...props}>
            <Modal.Body className="p-0 rounded-b-lg">
                <ProductBid />
            </Modal.Body>
        </Modal>
    );
}
