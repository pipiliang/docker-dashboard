import { Widget } from "./widget";
import { WidgetRender } from "../common/widgetrender";
import { Dockerode } from "../common/docker/dockerode";
import { Log } from "../common/log";
import { injectable } from "inversify";

@injectable()
export class NetworkWidget extends Widget {
    private netTable: any;

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
            const location = { top: 0, left: 0, width: "100%-2", height: "100%-2" };
            this.netTable = WidgetRender.table(box, location);
            const data = await Dockerode.singleton.listNetworks();
            this.netTable.setData(data);
        } catch (error) {
            Log.error(error);
        }
    }
}