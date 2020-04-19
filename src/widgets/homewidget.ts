import { WidgetRender } from "../common/widgetrender";
import { ColorText } from "../common/color";
import { Widget } from "./widget";
import { Dockerode } from "../common/docker/dockerode";
import { Log } from "../common/log";
import { injectable } from "inversify";

const os = require('os');

@injectable()
export class HomeWidget extends Widget {
    private table: any;
 
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
        return [this.table];
    }

    protected async renderWidget(box: any) {
        this.table = WidgetRender.table(box, 0, 0, "100%-2", "100%-2", "")
        const data = [
            [ColorText.title("Node Info"), ""],
            [ColorText.blue('Name'), os.hostname()],
            [ColorText.blue("OS"), os.platform() + "-" + os.arch()],
            [ColorText.blue("Release"), os.release()],
            [ColorText.blue("CPUs"), this.getCPUs()],
            [ColorText.blue("Memory"), (os.totalmem() / 1000 / 1000 / 1000).toFixed(1) + " GB"],
            [ColorText.blue("Up Time"), (os.uptime() / 60 / 60).toFixed(0) + " Hours"]
        ];

        data.push(["", ""]);
        try {
            const versionData = await Dockerode.singleton.version();
            versionData.forEach((vData: []) => data.push(vData));

            const dockerInfo = await Dockerode.singleton.information();
            dockerInfo.forEach((info: []) => data.push(info));

            const images = await Dockerode.singleton.totalImages();
            images.forEach((image: []) => data.push(image));
        } catch (error) {
            Log.info(error);
        }

        this.table.setData(data);
        this.refresh();
    };

    private getCPUs(): string {
        const cups = os.cpus();
        return (cups && cups.length) ? cups.length.toString() : "0";
    }
}