import { DockerDashboard } from "../dockerdashboard";
import { WidgetHelper } from "../common/widgethelper";
import { Widget } from "./widget";
import { Dockerode } from "../common/dockerode";


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

    getCommandKey() {
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
        this.table.hide();
        // this.text.hide();
        // this.net.hide();
        // this.mem.hide();
        // this.cpu.hide();
        // this.log.hide();
    }

    public show() {
        this.table.show();
        // this.text.show();
        // this.net.show();
        // this.mem.show();
        // this.cpu.show();
        // this.log.show();
    }

    protected async renderWidget(box: any) {
        this.table = WidgetHelper.renderTable(box, 0, 0, '100%-2', '40%-2', 'Containers');
        const data = await Dockerode.instance.listContainers();
        this.table.setData(data);
        this.text = WidgetHelper.renderText(box, '40%-2', 0, '100%-2', 2, '{bold}✔  Container Stats{bold}');
        this.cpu = WidgetHelper.renderLine({ top: '40%', left: 0 }, '50%-1', '30%', 'red', 'CPU Usage (%)');
        box.append(this.cpu);
        this.mem = WidgetHelper.renderLine({ top: '40%', right: 0 }, '50%-1', '30%', 'magenta', 'Memory Usage (MB)');
        box.append(this.mem);
        this.net = WidgetHelper.renderLine({ left: 0, bottom: 0 }, '50%-1', '30%-1', 'white', 'Net I/O (B)', true);
        box.append(this.net);
        this.log = WidgetHelper.renderInspectBox(box, 0, 0, '50%-1', '30%-1', 'inspect');
        this.table.on('select', (container: any) => {
            this.showSelectContainer(container);
        });
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