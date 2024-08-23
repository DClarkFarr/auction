import { Button, Label, TextInput } from "flowbite-react";
import { Product, ProductDetailItem } from "../../types/Product";
import { ChangeEvent, useEffect, useMemo, useState } from "react";

import TransIcon from "~icons/ic/baseline-delete";
import { debounce } from "lodash-es";

type DetailItems = Product["detailItems"];

export default function ManageDetailItems({
    detailItems,
    onChange,
}: {
    detailItems: DetailItems;
    onChange: (items: DetailItems) => Promise<void>;
}) {
    const onChangeItem = async (index: number, item: ProductDetailItem) => {
        const toSet = detailItems.map((old, i) => {
            return index === i ? { ...item } : old;
        });

        await onChange(toSet);
    };

    const onAddItem = async (_index: number, item: ProductDetailItem) => {
        const toSet = [...detailItems, item];

        await onChange(toSet);
    };

    const onRemoveItem = (index: number) => {
        onChange(detailItems.filter((_, i) => i !== index));
    };
    return (
        <div className="detail-items flex w-full flex-col gap-4">
            {detailItems.map((item, index) => {
                return (
                    <DetailItem
                        item={item}
                        key={index}
                        index={index}
                        onChange={onChangeItem}
                        onRemove={onRemoveItem}
                    />
                );
            })}

            <DetailItem
                item={{ label: "", description: "" }}
                key={detailItems.length}
                index={detailItems.length}
                onChange={onAddItem}
                isNew
            />
        </div>
    );
}

function DetailItem({
    item,
    index,
    onChange,
    onRemove,
    isNew,
}: {
    index: number;
    item: ProductDetailItem;
    isNew?: boolean;
    onChange: (index: number, item: ProductDetailItem) => Promise<void>;
    onRemove?: (index: number) => void;
}) {
    const [{ label, description }, setState] = useState({ ...item });

    const [dirty, setDirty] = useState({ label: false, description: false });

    useEffect(() => {
        setState({ ...item });
        setDirty({ label: false, description: false });
    }, [item, index]);

    const valid = useMemo(() => {
        const v = {
            label: true,
            description: true,
        };
        if (!label || !String(label)?.trim()) {
            v.label = false;
        }
        if (!description || !String(description).trim()) {
            v.description = false;
        }

        return v;
    }, [label, description]);

    const onClickRemove = () => {
        if (isNew) {
            setState({ label: "", description: "" });
        } else {
            if (typeof onRemove === "function") {
                onRemove(index);
            }
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDirty({ ...dirty, [e.target.name]: true });
        setState((prev) => {
            const toSet = { ...prev, [e.target.name]: e.target.value };

            if (toSet.label.trim().length && toSet.description.trim().length) {
                onChangeDebounced(() => {
                    onChange(index, toSet);
                });
            }
            return toSet;
        });
    };

    const onChangeDebounced = useMemo(() => {
        const debouncer = debounce((callback: () => void) => {
            callback();
        }, 350);

        return debouncer;
    }, []);

    return (
        <div className="detail-item flex w-full gap-x-3 items-start">
            <div className="w-2/5">
                <Label className="mb-2" htmlFor={`label-${index}`}>
                    Item label
                </Label>
                <TextInput
                    id={`label-${index}`}
                    name="label"
                    color={
                        valid.label || (!dirty.label && isNew) ? "" : "failure"
                    }
                    helperText={
                        valid.label || !dirty.label ? "" : "Label is required"
                    }
                    value={label}
                    onInput={handleInputChange}
                />
            </div>
            <div className="w-2/5">
                <Label className="mb-2" htmlFor={`description-${index}`}>
                    Item description
                </Label>
                <TextInput
                    id={`description-${index}`}
                    name="description"
                    color={
                        valid.description || (!dirty.description && isNew)
                            ? ""
                            : "failure"
                    }
                    helperText={
                        valid.description || !dirty.description
                            ? ""
                            : "Description is required"
                    }
                    value={description}
                    onInput={handleInputChange}
                />
            </div>
            <div className="w-1/5">
                <Label className="mb-2">&nbsp;</Label>
                <Button color="failure" onClick={onClickRemove}>
                    <TransIcon />
                </Button>
            </div>
        </div>
    );
}
