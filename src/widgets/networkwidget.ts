import { DockerDashboard } from "../dockerdashboard";
import { Widget } from "./widget";
import { WidgetRender } from "../common/widgetrender";
import { Dockerode } from "../common/dockerode";

export class NetworkWidget extends Widget {
    private netTable: any;

    constructor(dockerdashboard: DockerDashboard) {
        super(dockerdashboard);
    }

    getCommandName(): string {
        return 'Network';
    }

    getCommandKey(): { [key: string]: any } {
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
        this.netTable = WidgetRender.table(box, 0, 0, '100%-2', '100%-2', '');
        const data = await Dockerode.instance.listNetworks();
        this.netTable.setData(data);
    }
}