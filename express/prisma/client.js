import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
    console.log("creating prisma client");
    const pc = new PrismaClient({
        log: [
            {
                emit: "event",
                level: "query",
            },
        ],
    });
    // pc.$on("query", async (e) => {
    //     console.log(`Logging Query: ${e.query} ${e.params}`);
    // });

    return pc;
};

let _instance = null;

/**
 * @returns {PrismaClient<import("@prisma/client/runtime/library").DefaultArgs>}
 */
export function getPrisma() {
    if (!_instance) {
        _instance = prismaClientSingleton();
    }
    if (process.env.NODE_ENV !== "production") {
        globalThis.prismaClient = _instance;
    }

    // console.log("returning", globalThis.prismaClient, "and", _instance);
    return globalThis.prismaClient || _instance;
}
