import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

export type ProductsEvents = "bid" | "outbid";

export type ProductEventConfig = {
    id: string;
    event: ProductsEvents;
};
export type ProductsEventsStore = {
    events: Record<number, ProductEventConfig[]>;
    addEvent: (
        id_item: number,
        eventName: ProductsEvents,
        timeout?: number
    ) => void;
    dismissEvent: (id_item: number, id: string) => void;
};

const useProductsEventsStore = create<ProductsEventsStore>((set, get) => {
    const addEvent = (
        id_item: number,
        eventName: ProductsEvents,
        timeout = 4000
    ) => {
        const currentEvents = get().events[id_item] || [];

        const id = uuidv4();

        set({
            events: {
                ...get().events,
                [id_item]: [...currentEvents, { event: eventName, id }],
            },
        });

        setTimeout(() => {
            const currentEvents = get().events[id_item] || [];
            set({
                events: {
                    ...get().events,
                    [id_item]: currentEvents.filter((e) => e.id !== id),
                },
            });
        }, timeout);
    };

    const dismissEvent = (id_item: number, id: string) => {
        const currentEvents = get().events[id_item] || [];
        set({
            events: {
                ...get().events,
                [id_item]: currentEvents.filter((e) => e.id !== id),
            },
        });
    };
    return {
        events: {},
        addEvent,
        dismissEvent,
    };
});

export default useProductsEventsStore;

export const useProductEvents = (id_item: number) => {
    const { events, addEvent, dismissEvent } = useProductsEventsStore();

    const productEvents = events[id_item] || [];

    return {
        productEvents,
        addEvent: (eventName: ProductsEvents, timeout?: number) => {
            addEvent(id_item, eventName, timeout);
        },
        dismissEvent: (id: string) => {
            dismissEvent(id_item, id);
        },
    };
};
