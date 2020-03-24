import { DockerDashboard } from "../dockerdashboard";
import { Widget } from "./widget";
import { WidgetHelper } from "../common/widgethelper";

export class ImageWidget extends Widget {
    private imageTable: any;

    constructor(dockerdashboard: DockerDashboard) {
        super(dockerdashboard);
    }

    getCommandName(): string {
        return 'Images';
    }

    getCommandKey() {
        return {
            keys: ['I'],
            callback: () => {
                this.render();
            }
        };
    }

    public hide() {
        this.imageTable.hide();
    }
    public show() {
        this.imageTable.show();
    }

    renderWidget(box: any) {
        this.imageTable = WidgetHelper.renderTable(box, 0, 0, '100%-2', '50%', 'Images');
        this.imageTable.setData([
            ['Id', 'Repository', 'Tag', 'Size', 'Created']
        ]);
    }
}