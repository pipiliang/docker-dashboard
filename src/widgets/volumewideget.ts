import { Widget } from "./widget";
import { WidgetRender } from "../common/widgetrender";
import { Dockerode } from "../common/docker/dockerode";
import { Log } from "../common/log";
import { injectable } from "inversify";

@injectable()
export class VolumeWidget extends Widget {
    private volumeTable: any;

    getCommandName(): string {
        return "Volumes";
    }

    getCommandKey(): { [key: string]: any } {
        return {
            keys: ["v"],
            callback: () => {
                if (!this.volumeTable) {
                    this.render();
                }
                this.active();
            }
        };
    }

    public getAllElements(): Array<any> {
        return [this.volumeTable];
    }

    protected async renderWidget(box: any) {
        try {
            const location = { top: 0, left: 0, width: "100%-2", height: "100%-2" };
            this.volumeTable = WidgetRender.table(box, location);
            const data = await Dockerode.singleton.listVolumes();
            this.volumeTable.setData(data);
        } catch (error) {
            Log.error(error);
        }
    }
}