import { Server as SocketServer } from "socket.io";
import { env } from "./environment.js";

/**
 * @type {import('socket.io').Server | null}
 */
let _socket = null;

export function createSocket(server) {
    return (_socket = new SocketServer(server, {
        cors: {
            origin: env("socket.origin"),
            methods: ["GET", "POST"],
            allowedHeaders: [],
            credentials: true,
        },
    }));
}

export function getSocket() {
    if (!_socket) {
        throw new Error("Socket not initialized");
    }
    return _socket;
}
