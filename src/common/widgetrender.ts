import { Color, ColorText } from "./color";

const blessed = require('blessed');
const contrib = require('blessed-contrib');

type numstr = number | string;
type LocationOptions = { top?: numstr, left?: numstr, right?: numstr, bottom?: numstr, width: numstr, height: numstr };

/***
 * Render widgets : table \ box \ chart \ text
 */
export class WidgetRender {

    public static screen(title: string) {
        return blessed.screen({ smartCSR: true, fullUnicode: true, autoPadding: true, title: title });
    }

    /**
     * dram menu bar element
     * @param parent 
     * @param commands 
     */
    public static menuBar(parent: any, commands: { [name: string]: any }) {
        const bar = blessed.listbar({
            parent: parent, top: 0, left: 0, right: 0, height: 'shrink',
            mouse: true, keys: false, border: 'line',
            style: {
                item: { bg: Color.yellow, fg: Color.black, hover: { bg: Color.blue } },
                selected: { bg: Color.blue }
            },
            commands: commands
        });
        bar.focus();
        return bar;
    }

    /**
     * draw table
     * @param parent : parenet element
     * @param location : LocationOptions
     * @param label: table name
     */
    public static table(parent: any, location: LocationOptions, label: string = '', selectedColor?: string) {
        const cell = selectedColor ? { fg: Color.magenta, selected: { bg: selectedColor } } : { fg: Color.magenta };
        return blessed.listtable({
            parent: parent,
            top: location.top, left: location.left, width: location.width, height: location.height,
            border: 'line', align: Align.left,
            tags: true, keys: true, mouse: true,
            style: {
                fg: Color.white,
                header: { fg: Color.blue, bold: true, bg: Color.black },
                border: { fg: Color.black },
                // cell: { fg: Color.magenta, selected: { bg: selectedColor ? selectedColor : Color.blue } }
                cell: cell
            },
            label: label
        });
    };

    /**
     * draw a text element
     * @param parent : parent of text
     * @param location : text location
     * @param content : content of text element
     */
    public static text(parent: any, location: LocationOptions, content: string): any {
        return blessed.text({
            parent: parent,
            top: location.top, left: location.left, right: location.right, bottom: location.bottom, width: location.width, height: location.height,
            tags: true, keys: true,
            content: content
        });
    };


    public static drawInfomation(parent: any, location: LocationOptions, datas: string[][], padLenght: number = 10): any {
        let content = '';
        datas.forEach((data: string[]) => {
            content = content + ColorText.blue(data[0].padEnd(padLenght, ' ')) + data[1] + "\n";
        });
        return this.text(parent, location, content);
    }

    /**
     * draw line charts
     * @param location 
     * @param color : color of line
     * @param label : chart name
     * @param showLegend : show legend or not
     */
    public static line(location: LocationOptions, color: Color, label: string, showLegend = false): any {
        return new contrib.line({
            top: location.top, left: location.left, right: location.right, bottom: location.bottom, width: location.width, height: location.height,
            style: {
                line: color,
                text: Color.green,
                baseline: [Color.gray]
            },
            border: {
                type: "line",
                fg: Color.cyan
            },
            showNthLabel: 1,
            label: ' ' + label + ' ',
            xLabelPadding: 3,
            showLegend: showLegend,
            legend: { width: 4 }
        });
    };

    public static donut(location: LocationOptions) {
        return contrib.donut({
            top: location.top, left: location.left, right: location.right, bottom: location.bottom, width: location.width, height: location.height,
            radius: 10,
            arcWidth: 3,
            remainColor: Color.white,
            yPadding: 2,
            data: []
        });
    }

    /**
     * the parent element for showing widget
     * @param parent 
     */
    public static box(parent: any) {
        return blessed.box({
            parent: parent,
            align: Align.center,
            top: 2, left: 0, width: '100%', height: 'shrink',
            border: 'line',
            alwaysScroll: false, scrollable: true, scrollstep: 1,
            scrollbar: {
                ch: ' '
            }
        });
    }

    public static inspectBox(parent: any, location: LocationOptions, label: string): any {
        return this.drawBox(parent, location, '', label);
    };

    public static helpBox(parent: any, content: string) {
        const location = { top: 'center', left: 'center', width: '60%', height: 24 };
        return this.drawBox(parent, location, content, ' Help ', Color.black);
    }

    /**
     * draw a box element
     * @param parent : parent element
     * @param location : location of element
     * @param content : box content
     * @param label : name of box
     * @param bg : background color of box
     */
    private static drawBox(parent: any, location: LocationOptions, content: string, label: string, bg?: Color) {
        return blessed.box({
            parent: parent,
            label: label,
            scrollable: true, scrollstep: 1,
            top: location.top, left: location.left, right: location.right, bottom: location.bottom, width: location.width, height: location.height,
            align: Align.left,
            border: { type: 'line', fg: Color.cyan },
            content: content,
            style: { bg: bg },
            keys: true,
            mouse: true,
            vi: true,
            alwaysScroll: true,
            scrollbar: {
                ch: ' ',
                inverse: true
            }
        });
    }
}

export enum Align {
    left = 'left',
    right = 'right',
    center = 'center'
}