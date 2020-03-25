import { DockerDashboard } from "../dockerdashboard";
import { WidgetHelper } from "../common/widgethelper";
import { Color } from "../common/color";
import { Widget } from "./widget";
import { Dockerode } from "../common/dockerode";
import { Log } from "../common/log";

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
                if (!this.table) {
                    this.render();
                }
                this.active();
            }
        };
    }

    public hide() {
        this.table.hide();
    }
    public show() {
        this.table.show();
    }

    protected async renderWidget(box: any) {
        this.table = WidgetHelper.renderTable(box, 0, 0, '100%-2', '100%-2', '')
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
        try {
            const versionData = await Dockerode.instance.version();
            versionData.forEach((vData: []) => data.push(vData));

            const dockerInfo = await Dockerode.instance.information();
            dockerInfo.forEach((info: []) => data.push(info));

            const images = await Dockerode.instance.totalImages();
            images.forEach((image: []) => data.push(image));
        } catch (error) {
            Log.info(error);
        }

        this.table.setData(data);
    };

    private getCPUs(): string {
        const cups = os.cpus();
        return (cups && cups.length) ? cups.length.toString() : "0";
    }
}