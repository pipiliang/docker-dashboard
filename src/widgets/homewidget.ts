import { DockerDashboard } from "../dockerdashboard";
import { WidgetHelper } from "../common/widgethelper";
import { Color } from "../common/color";
import { Widget } from "./widget";
import { Dockerode } from "../common/dockerode";

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
            keys: ['D'],
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

        data.push(['', '']);
        data.push([Color.title('Docker Info'), '']);
        Dockerode.instance.version().then((v: any) => {
            data.push([Color.blue('Docker version'), v.Version]);
            data.push([Color.blue('Docker api version'), v.ApiVersion]);
            data.push([Color.blue('Go version'), v.GoVersion]);
            data.push([Color.blue('Build'), v.GitCommit]);
            data.push([Color.blue('Build time'), v.BuildTime]);
            data.push([Color.blue('Experimental'), v.Experimental]);
        }).catch((ex: any) => {
            data.push(['some error occurs when connect docker', '']);
        });

        return data;
    }

    private getCPUs(): string {
        const cups = os.cpus();
        return (cups && cups.length) ? cups.length.toString() : "0";
    }
}