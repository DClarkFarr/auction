import React, { HTMLAttributes, useEffect, useState } from "react";
import ChevronRightIcon from "~icons/ic/baseline-chevron-right";
import {
    AccordionContext,
    useAccordionContext,
} from "../../providers/useAccordionContext";

type AccordionSlot =
    | React.ReactNode
    | ((props: AccordionContext) => React.ReactNode);

export type AccordionProps = React.PropsWithChildren<{
    heading: AccordionSlot;
    initialOpen?: boolean;
    locked?: boolean;
}>;

export type AccordionHeadingProps = React.PropsWithChildren<{
    icon?: AccordionSlot;
}> &
    HTMLAttributes<HTMLDivElement>;

function AccordionIcon({ isOpen, setOpen }: AccordionContext) {
    return (
        <div className="accordion__handle" onClick={() => setOpen(!isOpen)}>
            <div className="p-2 cursor-pointer bg-gray-100 rounded">
                <ChevronRightIcon className={isOpen ? "rotate-90" : ""} />
            </div>
        </div>
    );
}
function AccordionHeading({
    children,
    icon = AccordionIcon,
    className,
    style,
}: AccordionHeadingProps) {
    const { isOpen, setOpen, locked } = useAccordionContext();

    return (
        <div
            className={
                "accordion__heading flex w-full items-center gap-4 " + className
            }
            style={style}
        >
            {typeof icon === "function"
                ? icon({ isOpen, setOpen, locked })
                : icon}
            <div
                onClick={() => !locked && setOpen(!isOpen)}
                className="cursor-pointer w-full"
            >
                <h3 className="text-lg font-semibold">{children}</h3>
            </div>
        </div>
    );
}

function AccordionDrawer({
    heading,
    children,
}: Omit<AccordionProps, "initialOpen">) {
    const { isOpen, setOpen, locked } = useAccordionContext();

    return (
        <div className="accordion">
            {typeof heading === "string" ? (
                <AccordionHeading>{heading}</AccordionHeading>
            ) : typeof heading === "function" ? (
                heading({ isOpen, setOpen, locked })
            ) : (
                heading
            )}

            <div className="accordion__body">{isOpen && children}</div>
        </div>
    );
}

function AccordionProvider({
    children,
    initialOpen,
    locked,
}: Omit<AccordionProps, "heading">) {
    const [isOpen, setOpen] = useState(initialOpen || false);

    useEffect(() => {
        setOpen(initialOpen || false);
    }, [initialOpen]);

    useEffect(() => {
        if (locked) {
            setOpen(initialOpen || false);
        }
    }, [locked, initialOpen]);

    return (
        <AccordionContext.Provider
            value={{ isOpen, setOpen, locked: locked || false }}
        >
            {children}
        </AccordionContext.Provider>
    );
}

function AccordionMain({
    children,
    initialOpen,
    heading,
    locked,
}: AccordionProps) {
    return (
        <AccordionProvider initialOpen={initialOpen} locked={locked}>
            <AccordionDrawer heading={heading}>{children}</AccordionDrawer>
        </AccordionProvider>
    );
}

const Accordion = Object.assign(AccordionMain, {
    Heading: AccordionHeading,
    Icon: AccordionIcon,
});

export default Accordion;
