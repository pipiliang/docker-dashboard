import { DockerDashboard } from "../dockerdashboard";
import { Widget } from "./widget";
const blessed = require('blessed');

export class HelpWidget extends Widget {
    private widget: any;

    constructor(dockerdashboard: DockerDashboard) {
        super(dockerdashboard);
    }

    getCommandName(): string {
        return 'Help';
    }

    getCommandKey() {
        return {
            keys: ['h'],
            callback: () => {
                if (!this.widget) {
                    this.render();
                }
                this.active();
            }
        };
    }

    public hide() {
        this.widget.hide();
    }
    public show() {
        this.widget.show();
    }

    renderWidget(box: any) {
        this.widget = blessed.box({
            parent: box,
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
            content:
                '\n' +
                '   Shortcut\n' +
                '   -----------------------------------------------------------------\n' +
                '   D       :  show node info.\n' +
                '   C       :  show container list.\n' +
                '   I       :  show iamge list.\n' +
                '   N       :  show network.\n' +
                '   V       :  show volume list.\n' +
                '   H       :  show help.\n' +
                '   Q       :  exit.\n' +
                '   \n' +
                '   About\n' +
                '   -----------------------------------------------------------------\n' +
                '   Github  :  https://github.com/pipiliang/docker-dashboard\n' +
                '   Issues  :  https://github.com/pipiliang/docker-dashboard/issues\n' +
                '   Lisence :  MIT\n' +
                '   Thanks  :  \n' +
                '              1. blessed \n' +
                '              2. blessed-contrib \n' +
                '              3. dockerode',
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
    // 🗻 🐞️ 🔑  🙏️
}