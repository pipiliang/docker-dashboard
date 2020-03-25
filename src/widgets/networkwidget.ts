import { DockerDashboard } from "../dockerdashboard";
import { Widget } from "./widget";
import { WidgetHelper } from "../common/widgethelper";
import { Dockerode } from "../common/dockerode";

export class NetworkWidget extends Widget {
    private netTable: any;

    constructor(dockerdashboard: DockerDashboard) {
        super(dockerdashboard);
    }

    getCommandName(): string {
        return 'Network';
    }

    getCommandKey() {
        return {
            keys: ['n'],
            callback: () => {
                if (!this.netTable) {
                    this.render();
                }
                this.active();
            }
        };
    }

    public hide() {
        this.netTable.hide();
    }

    public show() {
        this.netTable.show();
    }

    protected async renderWidget(box: any) {
        this.netTable = WidgetHelper.renderTable(box, 0, 0, '100%-2', '100%-2', '');
        const data = await Dockerode.instance.listNetworks();
        this.netTable.setData(data);
    }
}