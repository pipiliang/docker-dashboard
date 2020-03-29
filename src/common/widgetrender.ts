import { Color } from "./color";

const blessed = require('blessed');
const contrib = require('blessed-contrib');

export class WidgetRender {

    public static form(title: string) {
        return blessed.screen({ smartCSR: true, fullUnicode: true, autoPadding: true, title: title });
    }

    public static menuBar(parent: any, commands: { [name: string]: any }) {
        const bar = blessed.listbar({
            parent: parent,
            top: 0,
            left: 0,
            right: 0,
            height: 'shrink',
            mouse: true,
            keys: true,
            autoCommandKeys: true,
            border: 'line',
            style: {
                item: { bg: Color.yellow, fg: Color.black, hover: { bg: Color.blue } },
                selected: { bg: Color.blue }
            },
            commands: commands
        });
        bar.focus();
        return bar;
    }

    public static table(parent: any, top: any, left: any, width: any, height: any, label: any) {
        return blessed.listtable({
            parent: parent,
            top: top,
            left: left,
            border: 'line',
            align: 'left',
            tags: true,
            keys: true,
            width: width,
            height: height,
            mouse: true,
            style: {
                fg: Color.white,
                header: { fg: Color.blue, bold: true },
                border: { fg: Color.black },
                cell: { fg: Color.magenta, selected: { bg: Color.blue } }
            },
            label: label
        });
    };

    public static box(parent: any) {
        return blessed.box({
            parent: parent,
            align: 'center',
            scrollable: true,
            scrollstep: 1,
            left: 0,
            top: 2,
            width: '100%',
            height: 'shrink',
            border: 'line',
            alwaysScroll: false,
            scrollbar: {
                ch: ' '
            }
        });
    }

    public static text(parent: any, top: any, left: any, width: any, heigth: any, content: string): any {
        return blessed.text({
            parent: parent,
            top: top,
            left: left,
            tags: true,
            keys: true,
            width: width,
            height: heigth,
            content: content
        });
    };

    public static line(opts: any, width: any, height: any, color: any, label: any, showLegend = false, legendWidth = 4): any {
        return new contrib.line({
            top: opts.top,
            left: opts.left,
            right: opts.right,
            bottom: opts.bottom,
            width: width,
            height: height,
            style: {
                line: color,
                text: 'green',
                baseline: ['#696969']
            },
            border: {
                type: "line",
                fg: "cyan"
            },
            showNthLabel: 1,
            label: ' ' + label + ' ',
            xLabelPadding: 3,
            showLegend: showLegend,
            legend: {
                width: legendWidth
            },
        });
    };

    public static inspectBox(parent: any, right: any, bottom: any, width: any, height: any, label: any): any {
        return blessed.box({
            parent: parent,
            label: label,
            scrollable: true,
            scrollstep: 1,
            right: right,
            bottom: bottom,
            width: width,
            height: height,
            align: 'left',
            style: { fg: Color.blue },
            border: { type: 'line', fg: Color.cyan },
            content: '',
            keys: true,
            mouse: true,
            alwaysScroll: true,
            scrollbar: {
                ch: ' ',
                inverse: true
            }
        });
    };

    public static helpBox(parent: any, content : string) {
        return blessed.box({
            parent: parent,
            label: ' Help ',
            scrollable: true,
            scrollstep: 1,
            left: 'center',
            top: 'center',
            width: '60%',
            height: 24,
            align: 'left',
            style: {
                bg: 'black'
            },
            border: {
                type: "line",
                fg: "cyan"
            },
            content: content,
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