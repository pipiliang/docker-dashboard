export class ColorText {

    static readonly STOPPED = '{bold}{red-bg}{black-fg}stopped{/black-fg}{/red-bg}{/bold}';
    static readonly RUNNING = '{bold}{green-bg}{black-fg}running{/black-fg}{/green-bg}{/bold}';

    public static blue(str: string) {
        return '{blue-fg}' + str + '{/blue-fg}';
    }

    public static red(str: string) {
        return '{red-fg}' + str + '{/red-fg}';
    }

    public static cyan(str: string) {
        return '{cyan-fg}' + str + '{/cyan-fg}';
    }

    public static yellow(str: string) {
        return '{yellow-fg}' + str + '{/yellow-fg}';
    }

    public static title(str: string) {
        return '{white-bg} {/white-bg} ' + '{bold}{white-fg}' + str + '{/white-fg}{/bold}';
    }

    public static bold(str: string) {
        return '{bold}' + str + '{/bold}';
    }
}


export enum Color {
    black = 'black',
    yellow = 'yellow',
    blue = 'blue',
    magenta = 'magenta',
    white = 'white',
    cyan = 'cyan',
    green = 'green',
    red = 'red',
    gray = '#696969'
}