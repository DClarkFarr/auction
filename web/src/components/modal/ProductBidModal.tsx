import { Modal } from "flowbite-react";
import ProductBid from "../product/ProductBid";

type ProductBidModalProps = { onClose?: () => void };

export default function ProductBidModal(props: ProductBidModalProps) {
    const onPlaceBid = () => {
        if (typeof props.onClose === "function") {
            props.onClose();
        }
    };
    return (
        <Modal {...props}>
            <Modal.Body className="p-0 rounded-b-lg">
                <ProductBid onPlaceBid={onPlaceBid} />
            </Modal.Body>
        </Modal>
    );
}
