import { contextFactory } from "../utils/context";

export type AccordionContext = {
    isOpen: boolean;
    setOpen: (bool: boolean) => void;
};

export const [AccordionContext, useAccordionContext] =
    contextFactory<AccordionContext>();
