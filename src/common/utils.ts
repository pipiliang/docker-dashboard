import moment from "moment";

export const REFRESH_INTERNAL = 10 * 1000;

/**
 * Convert UTC to local time
 * @param timeString UTC Time String
 */
const toLocalDateTime = (timeString: string) => {
    const time = moment(timeString, "YYYY-MM-DD hh:mm:ss");
    return time.add(moment().utcOffset() / 60, "hours").format("YYYY-MM-DD hh:mm:ss");
};

const toLocalTime = (timeString: string) => {
    const time = moment(timeString, "YYYY-MM-DD hh:mm:ss");
    return time.add(moment().utcOffset() / 60, "hours").format("hh:mm:ss");
};

const fromNow = (timestamp: number) => {
    return moment(new Date(timestamp * 1000), 'YYYYMMDD').fromNow();
};

export { toLocalDateTime, toLocalTime, fromNow }