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
    private allElements: Array<any> = [];

    public getCommandName(): string {
        return "Dashboard";
    }

    public getCommandKey(): { [key: string]: any } {
        return {
            keys: ["d"],
            callback: () => {
                this.active();
            }
        };
    }

    public getAllElements(): Array<any> {
        return this.allElements;
    }

    protected async renderWidget(box: any) {
        // System Infomation
        this.allElements.push(WidgetRender.text(box, { top: 1, left: 1, width: "100%-5", height: 2 }, ColorText.title('System Infomation')));
        this.showCPUUasge(box);
        this.showSystemInfomation(box);
        // Docker Infomation
        this.allElements.push(WidgetRender.text(box, { top: 10, left: 1, width: "100%-5", height: 2 }, ColorText.title('Docker Infomation')));
        this.showDockerInfomation(box);
        // Statistics
        this.allElements.push(WidgetRender.text(box, { top: 20, left: 1, width: "100%-4", height: 2 }, ColorText.title('Statistics')));
        this.showStatistics(box);
  
        this.refresh();
    };

    private async showCPUUasge(box: any) {
        const donut = WidgetRender.donut({ top: 2, left: 53, width: 50, height: 10 });
        box.append(donut);
        donut.setData([
            { percent: 0, label: 'CPU Usage', color: Color.green },
            { percent: 0, label: 'MEM Usage', color: Color.cyan }
        ]);

        // clear it
        const interval = setInterval(() => {
            osutils.cpuUsage((v: number) => {
                const cpuusage = (v * 100.0).toFixed(2);
                const memusage = ((os.totalmem() - os.freemem()) / os.totalmem() * 100).toFixed(2);
                donut.setData([
                    { percent: cpuusage, label: 'CPU Usage', color: Color.green },
                    { percent: memusage, label: 'MEM Usage', color: Color.cyan }
                ]);
                this.refresh();
            });
        }, 1000);
        this.allElements.push(donut);
    }

    private async showSystemInfomation(box: any) {
        const data = [
            ['Name', os.hostname()],
            ["OS", os.platform() + "-" + os.arch()],
            ["Release", os.release()],
            ["CPUs", this.getCPUs()],
            ["Memory", (os.totalmem() / 1000 / 1000 / 1000).toFixed(2) + " GB"],
            ["Up Time", (os.uptime() / 60 / 60).toFixed(0) + " Hours"]
        ];
        const location = { top: 3, left: 3, width: 50, height: 6 };
        this.allElements.push(WidgetRender.drawInfomation(box, location, data, 22));
    }

    private async showDockerInfomation(box: any) {
        try {
            const data = await Dockerode.singleton.getDockerVersion();
            const location = { top: 12, left: 3, width: 50, height: 6 };
            this.allElements.push(WidgetRender.drawInfomation(box, location, data, 22));
            this.refresh();
        } catch (error) {
            Log.info(error);
        }
    }

    private getCPUs(): string {
        const cups = os.cpus();
        return (cups && cups.length) ? cups.length.toString() : "0";
    }

    private async showStatistics(box: any) {
        try {
            const data = await Dockerode.singleton.getStatistics();
            const location = { top: 22, left: 1, width: '100%-4', height: 4 };
            const statisticsTable = WidgetRender.table(box, location);
            statisticsTable.setData(data);

            this.allElements.push(statisticsTable);
            this.refresh();
        } catch (error) {
            Log.info(error);
        }
    }
}