import { DockerDashboard } from "../dockerdashboard";
import { Widget } from "./widget";
import { WidgetHelper } from "../common/widgethelper";
import { Dockerode } from "../common/dockerode";
import { Logger } from "../common/logger";

export class VolumeWidget extends Widget {
    private volumeTable: any;

    constructor(dockerdashboard: DockerDashboard) {
        super(dockerdashboard);
    }

    getCommandName(): string {
        return 'Volumes';
    }

    getCommandKey() {
        return {
            keys: ['V'],
            callback: () => {
                this.render();
            }
        };
    }

    public hide() {
        this.volumeTable.hide();
    }
    public show() {
        this.volumeTable.show();
    }

    renderWidget(box: any) {
        this.volumeTable = WidgetHelper.renderTable(box, 0, 0, '100%-2', '100%-2', '');
        const data = [['Name', 'Driver', 'Mountpoint']];
        
        Dockerode.instance.listVolumes((err: any, result: any) => {
            if (result && result.Volumes) {
                result.Volumes.forEach((v: any) => {
                    var row = [];
                    row.push(v.Name);
                    row.push(v.Driver);
                    row.push(v.Mountpoint);
                    data.push(row);
                });
            }
        });
        Logger.instance.info(data);
        this.volumeTable.setData(data);
    }
}