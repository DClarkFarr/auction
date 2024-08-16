import { get, set } from "lodash-es";
import { app } from "../app.js";

function getServerTimezone() {
    if (getServerTimezone.server_timezone) {
        return getServerTimezone.server_timezone;
    }
    return (getServerTimezone.server_timezone = app.env("server_timezone"));
}
function getTimezone() {
    if (getTimezone.timezone) {
        return getTimezone.timezone;
    }
    return (getTimezone.timezone = app.env("timezone"));
}

const toDb = (date) => {
    var m = moment.tz(date, getTimezone());
    if (!m.isValid()) {
        return date;
    }
    m.tz(getServerTimezone());

    return moment
        .tz(m.format("YYYY-MM-DD HH:mm:ss"), getServerTimezone())
        .toDate();
};

const fromDb = (date) => {
    var m = moment.tz(date, getServerTimezone());
    if (!m.isValid()) {
        return date;
    }
    m.tz(getTimezone());

    return moment(m.format("YYYY-MM-DD HH:mm:ss")).toDate();
};
const mapToDb = (arr, fetch) => {
    if (typeof fetch != "object") {
        fetch = [fetch];
    }
    if (!arr || !arr.length) {
        return false;
    }
    return arr.map((obj) => {
        for (var k = 0; k < fetch.length; k++) {
            const date = get(obj, fetch[k]);
            set(obj, fetch[k], toDb(date));
        }
        return obj;
    });
};
const mapFromDb = (arr, fetch) => {
    if (typeof fetch != "object") {
        fetch = [fetch];
    }
    if (!arr || !arr.length) {
        return false;
    }
    return arr.map((obj) => {
        for (var k = 0; k < fetch.length; k++) {
            const date = get(obj, fetch[k]);
            const m = moment(date, getServerTimezone());

            set(obj, fetch[k], fromDb(date));
        }
        return obj;
    });
};

export { fromDb, toDb, mapToDb, mapFromDb, getServerTimezone, getTimezone };
