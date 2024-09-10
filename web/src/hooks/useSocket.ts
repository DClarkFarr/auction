import React from "react";
import { io } from "socket.io-client";
import { FullProductItem } from "../types/Product";

const socket = io(import.meta.env.VITE_SOCKET_URL + "bid", {
    withCredentials: true,
});

export default function useSocket({
    onUpdate,
}: {
    onUpdate?: (product: FullProductItem) => void;
}) {
    React.useEffect(() => {
        socket.on("update", function (p: FullProductItem) {
            if (typeof onUpdate === "function") {
                onUpdate(p);
            }
        });

        return () => {
            socket.off("update");
        };
    }, []);
}
