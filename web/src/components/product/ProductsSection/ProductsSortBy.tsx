import { useProductsContext } from "../../../providers/useProductsContext";
import { ProductSortBy } from "../../../types/Product";
import Select, {
    components,
    SingleValue,
    SingleValueProps,
} from "react-select";

const sortValues: { value: ProductSortBy; label: string }[] = [
    {
        value: "expiring",
        label: "Expiring Soon",
    },
    {
        value: "lowPrice",
        label: "Lowest - Highest Price",
    },
    {
        value: "highPrice",
        label: "Highest - Lowest Price",
    },
    {
        value: "name",
        label: "Name",
    },
    {
        value: "quality",
        label: "Quality Highest - Lowest",
    },
];

const SingleValueCustom = ({
    children,
    ...props
}: SingleValueProps<(typeof sortValues)[0]>) => (
    <components.SingleValue {...props}>
        <div className="px-2 py-1 leading-none">
            <div className="text-xs text-gray-400">Sort By</div>
            <div className="text-lg font-semibold">{children}</div>
        </div>
    </components.SingleValue>
);

export default function ProductsSortBy() {
    const { params, setParams } = useProductsContext();
    const sortBy = params.sortBy;

    const defaultValue =
        sortValues.find((v) => v.value && v.value === sortBy) || sortValues[0];

    const handleChange = (e: SingleValue<(typeof sortValues)[0]>) => {
        if (!e) {
            return;
        }
        if (e.value === "expiring") {
            setParams({
                page: 1,
                sortBy: undefined,
            });
        } else {
            setParams({
                page: 1,
                sortBy: e.value,
            });
        }
    };

    return (
        <div>
            <Select
                isSearchable={false}
                className="lg:min-w-[265px]"
                options={sortValues}
                defaultValue={defaultValue}
                onChange={handleChange}
                isMulti={false}
                components={{
                    SingleValue: SingleValueCustom,
                }}
                theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                        ...theme.colors,
                        primary25: "#f3e8ff",
                        primary: "#6b21a8",
                    },
                })}
            />
        </div>
    );
}
