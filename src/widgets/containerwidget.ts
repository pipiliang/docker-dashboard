import { DockerDashboard } from "../dockerdashboard";
import { WidgetRender } from "../common/widgetrender";
import { Widget } from "./widget";
import { Dockerode } from "../common/dockerode";
import { Log } from "../common/log";


export class ContainerWidget extends Widget {
    private table: any;
    private text: any;
    private cpu: any;
    private mem: any;
    private net: any;
    private log: any;
    private selectId: string = "";


    constructor(dockerdashboard: DockerDashboard) {
        super(dockerdashboard);
    }

    getCommandName(): string {
        return 'Containers';
    }

    getCommandKey(): { [key: string]: any } {
        return {
            keys: ['c'],
            callback: () => {
                if (!this.table) {
                    this.render();
                }
                this.active();
            }
        };
    }

    public hide() {
        this.hideAll(this.table, this.text, this.mem, this.cpu, this.net, this.log);
    }

    public show() {
        this.showAll(this.table, this.text, this.mem, this.cpu, this.net, this.log);
    }

    private showAll(...widgets: any[]) {
        widgets.forEach((widget: any) => {
            if (widget) { widget.show(); }
        })
    }

    private hideAll(...widgets: any[]) {
        widgets.forEach((widget: any) => {
            if (widget) { widget.hide(); }
        })
    }

    protected async renderWidget(box: any) {
        try {
            this.table = WidgetRender.table(box, 0, 0, '100%-2', '40%-2', 'Containers');
            const data = await Dockerode.instance.listContainers();
            this.table.setData(data);
            this.table.on('select', (container: any) => {
                this.showSelectContainer(container);
            });
        } catch (error) {
            Log.error(error);
        }

        this.text = WidgetRender.text(box, '40%-2', 0, '100%-2', 2, '{bold}✔  Container Stats{bold}');
        this.cpu = WidgetRender.line({ top: '40%', left: 0 }, '50%-1', '30%', 'red', 'CPU Usage (%)');
        box.append(this.cpu);
        this.mem = WidgetRender.line({ top: '40%', right: 0 }, '50%-1', '30%', 'magenta', 'Memory Usage (MB)');
        box.append(this.mem);
        this.net = WidgetRender.line({ left: 0, bottom: 0 }, '50%-1', '30%-1', 'white', 'Net I/O (B)', true);
        box.append(this.net);
        this.log = WidgetRender.inspectBox(box, 0, 0, '50%-1', '30%-1', ' Inspect ');
    }

    private showSelectContainer(container: any) {
        const selectId = container.content.substring(0, 8);
        if (this.selectId == selectId) {
            return;
        }
        this.selectId = selectId;
        this.text.setContent('{bold}✔ Container Stats (' + selectId + '){bold}');
    }
}