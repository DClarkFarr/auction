import EventEmitter from "eventemitter3";
import React from "react";
import { FullProductItem } from "../types/Product";

const eventEmitter = new EventEmitter();

export type ModalEvents = "show:bid" | "wait:bid";
const ModalEmitter = {
    on: (event: ModalEvents, fn: (p: FullProductItem) => void) =>
        eventEmitter.on(event, fn),
    once: (event: ModalEvents, fn: (p: FullProductItem) => void) =>
        eventEmitter.once(event, fn),
    off: (event: ModalEvents, fn: (p: FullProductItem) => void) =>
        eventEmitter.off(event, fn),
    emit: (event: ModalEvents, payload: FullProductItem) =>
        eventEmitter.emit(event, payload),
};

Object.freeze(ModalEmitter);

export default ModalEmitter;

export function useModalEvent(
    event: ModalEvents,
    callback: (p: FullProductItem) => void
) {
    React.useEffect(() => {
        eventEmitter.addListener(event, callback);

        return () => {
            eventEmitter.removeListener(event, callback);
        };
    }, []);
}
