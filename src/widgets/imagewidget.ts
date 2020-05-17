import { Widget } from "./widget";
import { WidgetRender } from "../common/widgetrender";
import { Dockerode } from "../common/docker/dockerode";
import { Log } from "../common/log";
import { injectable } from "inversify";

@injectable()
export class ImageWidget extends Widget {
    private imageTable: any;
    private layerTable: any;
    private text: any;
    private selectId: string = "";

    getCommandName(): string {
        return "Images";
    }

    getCommandKey(): { [key: string]: any } {
        return {
            keys: ["i"],
            callback: () => {
                if (!this.imageTable) {
                    this.render();
                }
                this.active();
            }
        };
    }

    public getAllElements(): Array<any> {
        return [this.imageTable, this.layerTable, this.text];
    }

    protected async renderWidget(box: any) {
        try {
            const location = { top: 0, left: 0, width: "100%-2", height: "40%-2" };
            this.imageTable = WidgetRender.table(box, location, "Images");
            const data = await Dockerode.singleton.listImages();
            this.imageTable.setData(data);
            this.imageTable.on("select", (item: any) => {
                this.selectImage(item);
            });

            this.text = WidgetRender.text(box, { top: "40%-2", left: 0, width: "100%-2", height: 2 }, "{bold}✔  Image Infomation{bold}");
            this.layerTable = WidgetRender.table(box, { top: "40%", left: 0, width: "100%-2", height: "60%-1" }, "Layers");
        } catch (error) {
            Log.error(error);
        }
    }

    private async selectImage(item: any) {
        const selectId = item.content.substring(0, 12);
        if (this.selectId == selectId) {
            return;
        }
        this.selectId = selectId;
        // show selected id
        this.text.setContent("{bold}✔ Image Infomation (" + selectId + "){bold}");
        this.refresh();

        const image = Dockerode.singleton.getImage(this.selectId);
        const data = await image.history();
        this.layerTable.setData(data);
    }
}