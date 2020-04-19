export class ColorText {

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
        return '{bold}{white-fg}' + str + '{/white-fg}{/bold}';
    }
}


export enum Color {
    black = 'black',
    yellow = 'yellow',
    blue = 'blue',
    magenta = 'magenta',
    white = 'white',
    cyan = 'cyan',
    green = 'green'
}