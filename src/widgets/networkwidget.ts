import { DockerDashboard } from "../dockerdashboard";
import { Widget } from "./widget";
import { WidgetRender } from "../common/widgetrender";
import { Dockerode } from "../common/docker/dockerode";
import { Log } from "../common/log";

export class NetworkWidget extends Widget {
    private netTable: any;

    constructor(dockerdashboard: DockerDashboard) {
        super(dockerdashboard);
    }

    getCommandName(): string {
        return "Network";
    }

    getCommandKey(): { [key: string]: any } {
        return {
            keys: ["n"],
            callback: () => {
                if (!this.netTable) {
                    this.render();
                }
                this.active();
            }
        };
    }

    public getAllElements(): Array<any> {
        return [this.netTable];
    }

    protected async renderWidget(box: any) {
        try {
            this.netTable = WidgetRender.table(box, 0, 0, "100%-2", "100%-2", "");
            const data = await Dockerode.singleton.listNetworks();
            this.netTable.setData(data);
        } catch (error) {
            Log.error(error);
        }
    }
}