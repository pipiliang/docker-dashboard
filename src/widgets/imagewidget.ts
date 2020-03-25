import { DockerDashboard } from "../dockerdashboard";
import { Widget } from "./widget";
import { WidgetHelper } from "../common/widgethelper";
import { Dockerode } from "../common/dockerode";

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
            keys: ['i'],
            callback: () => {
                if (!this.imageTable) {
                    this.render();
                }
                this.active();
            }
        };
    }

    public hide() {
        this.imageTable.hide();
    }

    public show() {
        this.imageTable.show();
    }

    protected async renderWidget(box: any) {
        this.imageTable = WidgetHelper.renderTable(box, 0, 0, '100%-2', '100%-2', 'Images');
        const data = await Dockerode.instance.listImages();
        this.imageTable.setData(data);
    }
}