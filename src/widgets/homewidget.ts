import { DockerDashboard } from "../dockerdashboard";
import { WidgetHelper } from "../common/widgethelper";
import { Color } from "../common/color";
import { Widget } from "./widget";

const os = require('os');

export class HomeWidget extends Widget {
    private table: any;
    constructor(dockerdashboard: DockerDashboard) {
        super(dockerdashboard);
    }

    public getCommandName(): string {
        return 'Dashboard';
    }

    public getCommandKey() {
        return {
            keys: ['d'],
            callback: () => {
                this.render()
            }
        };
    }

    public hide() {
        this.table.hide();
    }
    public show() {
        this.table.show();
    }

    public renderWidget(box: any) {
        this.table = WidgetHelper.renderTable(box, 0, 0, '100%-2', '100%-2', '')
        this.table.setData(this.getData());
    };

    private getData() {
        const data = [
            [Color.title('Node Info'), ''],
            [Color.blue('Name'), os.hostname()],
            [Color.blue('OS'), os.platform() + '-' + os.arch()],
            [Color.blue('Release'), os.release()],
            [Color.blue('CPUs'), this.getCPUs()],
            [Color.blue('Memory'), (os.totalmem() / 1000 / 1000 / 1000).toFixed(1) + 'GB'],
            [Color.blue('Up Time'), (os.uptime() / 60 / 60).toFixed(0) + ' Hours']
        ];

        return data;
    }

    private getCPUs(): string {
        const cups = os.cpus();
        return (cups && cups.length) ? cups.length.toString() : "0";
    }
}