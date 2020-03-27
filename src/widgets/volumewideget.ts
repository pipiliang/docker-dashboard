import { DockerDashboard } from "../dockerdashboard";
import { Widget } from "./widget";
import { WidgetHelper } from "../common/widgethelper";
import { Dockerode } from "../common/dockerode";
import { Log } from "../common/log";

export class VolumeWidget extends Widget {
    private volumeTable: any;

    constructor(dockerdashboard: DockerDashboard) {
        super(dockerdashboard);
    }

    getCommandName(): string {
        return 'Volumes';
    }

    getCommandKey(): { [key: string]: any } {
        return {
            keys: ['v'],
            callback: () => {
                if (!this.volumeTable) {
                    this.render();
                }
                this.active();
            }
        };
    }

    public hide() {
        this.volumeTable.hide();
    }
    public show() {
        this.volumeTable.show();
    }

    protected async renderWidget(box: any) {
        this.volumeTable = WidgetHelper.renderTable(box, 0, 0, '100%-2', '100%-2', '');
        const data = await Dockerode.instance.listVolumes();
        this.volumeTable.setData(data);
    }
}