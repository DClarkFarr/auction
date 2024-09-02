import { DateTime } from "luxon";

export const timeCompareMulti = (
    timeBefore: DateTime,
    timeAfter: DateTime,
    maxSegmengs = 2,
    suffix = ""
) => {
    const { hours, minutes, seconds, days } = timeAfter.diff(timeBefore, [
        "hours",
        "minutes",
        "seconds",
        "days",
    ]);

    const segments = [
        [days, "day"] as [number, string],
        [hours, "hr"] as [number, string],
        [minutes, "min"] as [number, string],
        [seconds, "sec"] as [number, string],
    ]
        .filter(([n]) => n >= 1)
        .map(([number, word]) => {
            const n = Math.floor(number);
            return `${n} ${word}${suffix ? ` ${suffix}` : ""}`;
        });

    return segments.slice(0, maxSegmengs);
};

export const timeCompare = (
    timeBefore: DateTime,
    timeAfter: DateTime,
    suffix = ""
) => {
    const { hours, minutes, seconds, days } = timeAfter.diff(timeBefore, [
        "hours",
        "minutes",
        "seconds",
        "days",
    ]);

    if (seconds < 1) {
        return "Now";
    }

    if (minutes < 1) {
        return `${Math.floor(seconds)} seconds${suffix ? ` ${suffix}` : ""}`;
    }
    if (hours < 1) {
        return `${Math.floor(minutes)} minutes${suffix ? ` ${suffix}` : ""}`;
    }
    if (days < 1) {
        return `${Math.floor(hours)} hours${suffix ? ` ${suffix}` : ""}`;
    }

    return `${Math.floor(days)} days${suffix ? ` ${suffix}` : ""}`;
};
