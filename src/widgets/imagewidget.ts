import { DockerDashboard } from "../dockerdashboard";
import { Widget } from "./widget";
import { WidgetRender } from "../common/widgetrender";
import { Dockerode } from "../common/dockerode";

export class ImageWidget extends Widget {
    private imageTable: any;

    constructor(dockerdashboard: DockerDashboard) {
        super(dockerdashboard);
    }

    getCommandName(): string {
        return 'Images';
    }

    getCommandKey(): { [key: string]: any } {
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
        this.imageTable = WidgetRender.table(box, 0, 0, '100%-2', '100%-2', 'Images');
        const data = await Dockerode.instance.listImages();
        this.imageTable.setData(data);
    }
}