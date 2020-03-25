const blessed = require('blessed');
const contrib = require('blessed-contrib');

export class WidgetHelper {

    public static renderTable(parent: any, top: any, left: any, width: any, height: any, label: any) {
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
            vi: true,
            mouse: true,
            style: {
                fg: 'white',
                header: {
                    fg: 'blue',
                    bold: true
                },
                border: {
                    fg: 'black'
                },
                cell: {
                    fg: 'magenta',
                    selected: {
                        bg: 'blue'
                    }
                }
            },
            label: label
        });
    };

    public static renderBox(parent: any) {
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

    public static renderText(parent: any, top: any, left: any, width: any, heigth: any, content: string) {
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

    public static renderLine(opts: any, width: any, height: any, color: any, label: any, showLegend = false, legendWidth = 4) {
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

    public static renderInspectBox(parent: any, right: any, bottom: any, width: any, height: any, label: any) {
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
            style: {
                fg: 'blue'
            },
            border: {
                type: 'line',
                fg: 'cyan'
            },
            content: '',
            keys: true,
            mouse: true,
            vi: true,
            alwaysScroll: true,
            scrollbar: {
                ch: ' ',
                inverse: true
            }
        });
    };
}