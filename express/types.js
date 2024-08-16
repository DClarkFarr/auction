/**
 * @typedef {import("mongodb").Document} D
 */

/**
 * @typedef {object} C
 * @property {string} userId
 * @property {string} externalId
 * @property {string} image
 * @property {string} name
 * @property {string} ticker
 * @property {string} createdAt
 * @property {number} order
 *
 * @typedef {D & C} CoinDocument
 */

/**
 * @typedef {object} SC
 * @property {string} externalId
 * @property {string} name
 * @property {string} symbol
 * @property {string} createdAt
 *
 * @typedef {D & SC} SourceCoinDocument
 */

/**
 * @typedef {object} U
 * @property {string} name
 * @property {string} email
 * @property {string} password
 * @property {string} createdAt
 *
 * @typedef {D & U} UserDocument
 */

/**
 * @typedef {object} CA
 * @property {string} ticker
 * @property {string} coinId
 * @property {number} miliseconds
 * @property {string} isoDate
 * @property {Date} date
 * @property {{
 *  index: number
 *  isoDate: string
 *  price: number
 *  marketCap: number
 *  volume: number
 * }[]} hours
 * @property {} marketCap
 * @property {} totalVolume
 * @property {} minPrice
 * @property {} maxPrice
 * @property {} avgPrice
 *
 * @typedef {D & CA} CandleDocument
 */

/**
 * @typedef {object} MCC
 * @property {string} ticker
 * @property {string} externalId
 * @property {string} isoDate
 * @property {number} rank
 * @property {number} marketCap
 * @property {number} dailyHigh
 * @property {number} fullyDilutedValuation
 * @property {number} volume
 * @property {number} totalSupply
 * @property {number} maxSupply
 * @property {{
 *   price: number,
 *   percent: number,
 *   date: string,
 * }} ath
 * @property {string} createdAt
 *
 * @typedef {D & MCC} MarketCapCandleDocument
 */

export const MILESTONE_TYPES = Object.freeze({
    CAP_PERCENT: "cap-percent",
    PRICE_PERCENT: "price-percent",
    DAILY_HIGH: "daily-high",
    DAILY_LOW: "daily-low",
    NEW: "new",
    RANK_TIER: "rank-tier",
    VOLUME_RATIO: "volume-ratio",
    VOLUME_SPIKE: "volume-spike",
});
/**
 * @typedef {"cap-percent" | "price-percent" | "daily-high" | "daily-low" | "new" | "rank-tier"  } MilestoneTypes
 */

/**
 * @typedef {object} MS
 * @property {string} ticker
 * @property {string} externalId
 * @property {string} isoDate
 * @property {MilestoneTypes} type
 * @property {string} value
 * @property {MCC} market
 * @property {string} createdAt
 *
 * @typedef {D & MS} MilestoneDocument
 */

export const ALERT_OPERATORS = Object.freeze({
    GTE: "gte",
    LTE: "lte",
    EQ: "eq",
});

/**
 * @typedef {"gte" | "lte" | "eq"} AlertOperators
 */

export const ALERT_TYPES = Object.freeze({
    PRICE: "price",
    MARKET_CAP: "market-cap",
    RANK: "rank",
    DAILY_HIGH: "daily-high",
    DAILY_LOW: "daily-low",
    VOLUME_RATIO: "volume-ratio",
    VOLUME_SPIKE: "volume-spike",
});

/**
 * @typedef {"price" | "market-cap" | "rank" | "daily-high" | "daily-low" | "volume-ratio" | "volume-spike"} AlertTypes
 */

/**
 * @typedef {object} A
 * @property {string} userId
 * @property {string} description
 * @property {AlertOperators} operator
 * @property {AlertTypes} type
 * @property {string} value
 * @property {boolean} active
 * @property {string} activatedAt
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {SourceCoinDocument} sourceCoin
 *
 * @typedef {D & A} AlertDocument
 */

/**
 * @typedef {object} UA
 * @property {string} userId
 * @property {string} smartDescription
 * @property {boolean} isSeen
 * @property {MarketCapCandleDocument} market
 * @property {AlertDocument} alert
 * @property {string} updatedAt
 * @property {string} createdAt
 *
 * @typedef {D & UA} UserAlertDocument
 */

/**
 * @typedef {object} UT
 * @property {"web" | "sw" | "unknown"} source
 * @property {string} userId
 * @property {string} deviceId
 * @property {string} token
 * @property {string} name
 * @property {string} updatedAt
 * @property {string} createdAt
 *
 * @typedef {D & UT} UserTokenDocument
 */

export default {};
