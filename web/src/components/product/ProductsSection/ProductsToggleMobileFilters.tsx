import { Button, Drawer } from "flowbite-react";
import React, { useEffect } from "react";
import FiltersIcon from "~icons/ic/outline-settings-input-component";

export type ProductsToggleMobileFiltersProps = {
    visible?: boolean;
};

const ProductsToggleMobileFilters = React.forwardRef<
    HTMLDivElement,
    ProductsToggleMobileFiltersProps
>(function ({ visible }, ref) {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleClose = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        if (typeof visible === "boolean" && !visible && isOpen) {
            setIsOpen(false);
        }
    }, [visible]);

    return (
        <>
            <Button color="light" size="sm" onClick={() => setIsOpen(true)}>
                <FiltersIcon /> <span className="pl-2">Filters</span>
            </Button>
            <Drawer
                open={isOpen}
                onClose={handleClose}
                theme={{
                    root: {
                        position: {
                            left: {
                                on: "left-0 top-0 h-screen w-80 max-w-screen transform-none",
                                off: "left-0 top-0 h-screen w-80 max-w-screen -translate-x-full",
                            },
                        },
                    },
                }}
            >
                <Drawer.Header
                    title="Search Filters"
                    titleIcon={() => (
                        <div className="pr-3">
                            <FiltersIcon />
                        </div>
                    )}
                />
                <Drawer.Items>
                    <div ref={ref}></div>
                </Drawer.Items>
            </Drawer>
        </>
    );
});
export default ProductsToggleMobileFilters;
