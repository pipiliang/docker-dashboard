import { DockerDashboard } from "../dockerdashboard";
import { WidgetHelper } from "../common/widgethelper";
import { Widget } from "./widget";


export class ContainerWidget extends Widget {
    private table: any;

    constructor(dockerdashboard: DockerDashboard) {
        super(dockerdashboard);
    }

    getCommandName(): string {
        return 'Container';
    }

    getCommandKey() {
        return {
            keys: ['c'],
            callback: () => {
                this.render();
            }
        };
    }

    public hide() {
        this.table.hide();
    }
    public show() {
        this.table.show();
    }

    renderWidget(box: any) {
        this.table = WidgetHelper.renderTable(box, 0, 0, '100%-2', '40%-2', 'Containers');
        this.table.setData([
            ['Id', 'Name', 'Image', 'IP', 'Ports', 'State']
        ]);
    }
}