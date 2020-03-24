import { configure, getLogger } from 'log4js';

export class Logger {

    private static _instance: Logger;
    private log: any;

    public static get instance(): Logger {
        if (!this._instance) {
            this._instance = new Logger();
        }
        return this._instance;
    }

    private constructor() {
        configure({
            appenders: { cheese: { type: "file", filename: "docker-dashboard.log" } },
            categories: { default: { appenders: ["cheese"], level: "error" } }
        });
        this.log = getLogger();
        this.log.level = "debug";
    }

    public info(message: any) {
        return this.log.info(message);
    }

}