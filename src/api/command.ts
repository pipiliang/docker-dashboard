export interface Command {

    getCommandName(): string;

    getCommandKey(): { [key: string]: any };

}