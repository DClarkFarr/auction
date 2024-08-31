import { Reorder } from "framer-motion";
import React from "react";

type OrderListProps<I> = React.PropsWithChildren<{
    active?: boolean;
    gap?: string;
    rows: I[];
    getKey: (v: I) => string;
    onChange: (items: I[]) => void;
}>;
export default function ReorderList<I>({
    active = true,
    gap = "gap-4",
    children,
    rows,
    onChange,
    getKey,
}: OrderListProps<I>) {
    const onReorder = (rs: typeof rows) => {
        onChange(rs);
    };

    if (!active) {
        return <>{children}</>;
    }
    return (
        <Reorder.Group
            axis="y"
            values={rows}
            onReorder={onReorder}
            className={`flex flex-col w-full ${gap}`}
        >
            {React.Children.map(children, (child, i) => {
                return (
                    <Reorder.Item key={getKey(rows[i])} value={rows[i]}>
                        {child}
                    </Reorder.Item>
                );
            })}
        </Reorder.Group>
    );
}
