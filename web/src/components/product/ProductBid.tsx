import { Alert, Button, TextInput } from "flowbite-react";
import useProductBidStore from "../../stores/useProductBidStore";
import useUserStore from "../../stores/useUserStore";
import { uploadedAsset } from "../../utils/asset";
import { formatCurrency } from "../../utils/currency";
import PlusIcon from "~icons/ic/baseline-add";
import MinusIcon from "~icons/ic/baseline-minus";
import React from "react";
import { usePlaceBidMutation } from "../../hooks/usePaginatedActiveItemsQuery";
import useToastContext from "../../providers/useToastContext";
import { AxiosError } from "axios";

export default function ProductBid() {
    const { product, bidAmount, setBidAmount, setProduct } =
        useProductBidStore();
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const { user, paymentMethod } = useUserStore();
    const { toast } = useToastContext();

    const placeBid = usePlaceBidMutation();

    if (!product) {
        return <Alert color="failure">No product set</Alert>;
    }

    if (!user) {
        return <Alert color="failure">Must be logged in</Alert>;
    }

    if (!paymentMethod) {
        return <Alert color="failure">Must have payment method</Alert>;
    }

    const currentPrice = product.bid
        ? product.bid.amount
        : product.product.priceInitial;

    const nextAmount = product.bid
        ? product.bid.amount + 1
        : product.product.priceInitial;

    const onClickPlus = () => {
        setBidAmount(bidAmount + 1);
    };

    const onClickMinus = () => {
        setBidAmount(bidAmount - 1);
    };

    const onBidInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const amount = Number(e.target.value);
        setBidAmount(amount);
    };

    const onSubmitBid = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const newProduct = await placeBid({
                id_item: product.id_item,
                amount: bidAmount,
            });

            setProduct(newProduct);

            toast({
                text: "Bid placed successfully",
                type: "success",
            });
        } catch (err) {
            if (err instanceof AxiosError) {
                console.warn("Caught error placing bid", err);
                toast({
                    text:
                        err.response?.data?.message ||
                        "Bid could not be placed",
                    type: "failure",
                });
            } else if (err instanceof Error) {
                console.warn("Unknown error placing bid", err);
                toast({
                    text: "Bid could not be placed",
                    type: "failure",
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={onSubmitBid}>
            <div className="bid">
                <div className="bid__product">
                    <div className="product__img">
                        <img
                            className="aspect-[2] object-fit object-center w-full"
                            src={uploadedAsset(product.product.images[0].path)}
                            alt={product.product.images[0].alt}
                        />
                    </div>
                    <div className="product__name p-4 text-xl">
                        {product.product.name}
                    </div>
                </div>
                <div className="amount p-4">
                    <div className="amount__current text-gray-500">
                        Current Price: {formatCurrency(currentPrice)}
                    </div>
                    <div className="amount__next text-lg text-emerald-600">
                        Next Minimum bid: {formatCurrency(nextAmount)}
                    </div>
                </div>
                <div className="bid__input p-4">
                    <div className="flex">
                        <div className="shrink">
                            <Button
                                type="button"
                                onClick={onClickMinus}
                                color="gray"
                                disabled={bidAmount <= nextAmount}
                            >
                                <MinusIcon />
                            </Button>
                        </div>
                        <div className="grow">
                            <TextInput
                                type="number"
                                step=".1"
                                min={nextAmount}
                                value={bidAmount}
                                onInput={onBidInput}
                            />
                        </div>
                        <div className="shrink">
                            <Button
                                onClick={onClickPlus}
                                color="gray"
                                type="button"
                            >
                                <PlusIcon />
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="bid__submit p-4">
                    <Button
                        type="submit"
                        className="w-full"
                        size="md"
                        disabled={bidAmount < nextAmount || isSubmitting}
                        isProcessing={isSubmitting}
                    >
                        {isSubmitting ? "Placing bid..." : "Place Bid"}
                    </Button>
                </div>
            </div>
        </form>
    );
}
