export interface Command {

    /**
     * get command name for listbar
     */
    getCommandName(): string;

    /**
     * get command key and callback for listbar
     */
    getCommandKey(): { [key: string]: any };

}