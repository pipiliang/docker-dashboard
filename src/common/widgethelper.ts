const blessed = require('blessed');

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
}