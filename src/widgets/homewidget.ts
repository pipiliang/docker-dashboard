import { WidgetRender } from "../common/widgetrender";
import { ColorText, Color } from "../common/color";
import { Widget } from "./widget";
import { Dockerode } from "../common/docker/dockerode";
import { Log } from "../common/log";
import { injectable } from "inversify";

const os = require('os');
import osutils from 'os-utils';

@injectable()
export class HomeWidget extends Widget {
    private table: any;
    private donut: any;
    private allElements: Array<any> = [];

    public getCommandName(): string {
        return "Dashboard";
    }

    public getCommandKey(): { [key: string]: any } {
        return {
            keys: ["d"],
            callback: () => {
                if (!this.table) {
                    this.render();
                }
                this.active();
            }
        };
    }

    public getAllElements(): Array<any> {
        return this.allElements;
    }

    protected async renderWidget(box: any) {
        this.allElements.push(WidgetRender.text(box, { top: 0, left: 1, width: "100%-5", height: 2 }, ColorText.title('System Infomation')));
        this.showCPUUasge(box);
        this.showSystemInfomation(box);
        this.allElements.push(WidgetRender.text(box, { top: 12, left: 1, width: "100%-5", height: 2 }, ColorText.title('Docker Infomation')));
        this.showDockerInfomation(box);
        // try {
        //     const versionData = await Dockerode.singleton.version();
        //     versionData.forEach((vData: []) => data.push(vData));

        //     const dockerInfo = await Dockerode.singleton.information();
        //     dockerInfo.forEach((info: []) => data.push(info));

        //     const images = await Dockerode.singleton.totalImages();
        //     images.forEach((image: []) => data.push(image));
        // } catch (error) {
        //     Log.info(error);
        // }

        // this.table.setData(data);
        this.refresh();
    };

    private async showCPUUasge(box: any) {
        this.donut = WidgetRender.donut({ top: 2, left: 53, width: 50, height: 10 });
        box.append(this.donut);
        this.donut.setData([
            { percent: 0, label: 'CPU Usage', color: Color.green },
            { percent: 0, label: 'MEM Usage', color: Color.cyan }
        ]);

        // clear it
        const interval = setInterval(() => {
            osutils.cpuUsage((v: number) => {
                const cpuusage = (v * 100.0).toFixed(2);
                const memusage = ((os.totalmem() - os.freemem()) / os.totalmem() * 100).toFixed(2);
                this.donut.setData([
                    { percent: cpuusage, label: 'CPU Usage', color: Color.green },
                    { percent: memusage, label: 'MEM Usage', color: Color.cyan }
                ]);
                this.refresh();
            });
        }, 1000);
        this.allElements.push(this.donut);
    }

    private async showSystemInfomation(box: any) {
        const data = [
            ['Name', os.hostname()],
            ["OS", os.platform() + "-" + os.arch()],
            ["Release", os.release()],
            ["CPUs", this.getCPUs()],
            ["Memory", (os.totalmem() / 1000 / 1000 / 1000).toFixed(1) + " GB"],
            ["Up Time", (os.uptime() / 60 / 60).toFixed(0) + " Hours"]
        ];
        const location = { top: 3, left: 3, width: 50, height: 6 };
        this.allElements.push(WidgetRender.drawInfomation(box, location, data, 22));
    }

    private async showDockerInfomation(box: any) {
        try {
            const data = await Dockerode.singleton.version();
            const location = { top: 14, left: 3, width: 50, height: 6 };
            this.allElements.push(WidgetRender.drawInfomation(box, location, data, 22));
            this.refresh();
        } catch (error) {
            Log.info(error);
        }
        // const data = [
        //     ['Name', os.hostname()],
        //     ["OS", os.platform() + "-" + os.arch()],
        //     ["Release", os.release()],
        //     ["CPUs", this.getCPUs()],
        //     ["Memory", (os.totalmem() / 1000 / 1000 / 1000).toFixed(1) + " GB"],
        //     ["Up Time", (os.uptime() / 60 / 60).toFixed(0) + " Hours"]
        // ];
        // const location = { top: 3, right: 0, width: "100%-50", height: 6 };
        // this.allElements.push(WidgetRender.drawInfomation(box, location, data));
    }

    private getCPUs(): string {
        const cups = os.cpus();
        return (cups && cups.length) ? cups.length.toString() : "0";
    }
}