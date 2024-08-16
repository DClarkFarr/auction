import moment from "moment";

export const isDate = (val) => moment(val).isValid();
