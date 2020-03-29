import { configure, getLogger } from 'log4js';

configure({
    appenders: { dashboard: { type: "file", filename: "docker-dashboard.log" } },
    categories: { default: { appenders: ["dashboard"], level: "error" } }
});

const logger = getLogger();
logger.level = "debug";

export class Log {

    public static debug(message: any) {
        return logger.debug(message);
    }

    public static info(message: any) {
        return logger.info(message);
    }

    public static error(message: any) {
        return logger.error(message);
    }

    public static warn(message: any) {
        return logger.warn(message);
    }

}