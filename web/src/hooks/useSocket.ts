import React from "react";
import { io } from "socket.io-client";
import { FullProductItem } from "../types/Product";

const socket = io(import.meta.env.VITE_SOCKET_URL + "bid", {
    withCredentials: true,
});

export default function useSocket(
    onUpdate: React.RefObject<((product: FullProductItem) => void) | null>
) {
    React.useEffect(() => {
        const method = function (p: FullProductItem) {
            if (onUpdate.current) {
                onUpdate.current(p);
            }
        };

        socket.on("update", method);

        return () => {
            socket.off("update", method);
        };
    }, []);
}
