import { env } from "./environment.js";

/**
 *
 * @param {{
 * name: string;
 * port: string;
 * host: string;
 * user: string;
 * password: string;
 * socket: string;
 * }} config
 */
export default function createDBUrl(config) {
    // mysql://username:password@127.0.0.1:8889/dbName?socket=/Applications/MAMP/tmp/mysql/mysql.sock

    let url = `mysql://${config.user}:${config.password}@${config.host}:${config.port}/${config.name}`;

    if (config.socket) {
        url += `?socket=${config.socket}`;
    }

    url += (url.indexOf("?") > -1 ? "&" : "?") + "timezone=Z";

    return url.toString();
}

export function createDbUrlFromEnv() {
    return createDBUrl(env("db"));
}
