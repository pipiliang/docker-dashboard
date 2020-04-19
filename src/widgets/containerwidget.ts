import { WidgetRender } from "../common/widgetrender";
import { Widget } from "./widget";
import { Dockerode } from "../common/docker/dockerode";
import { Log } from "../common/log";
import { Usage, EMPTY_NET_DATA } from "../common/docker/container";
import { injectable } from "inversify";

@injectable()
export class ContainerWidget extends Widget {
    private table: any;
    private text: any;
    private cpu: any;
    private mem: any;
    private net: any;
    private log: any;
    private selectId: string = "";
    private stream: any;

    getCommandName(): string {
        return "Containers";
    }

    getCommandKey(): { [key: string]: any } {
        return {
            keys: ["c"],
            callback: () => {
                if (!this.table) {
                    this.render();
                    this.table.focus();
                }
                this.active();
            }
        };
    }

    public getAllElements(): Array<any> {
        return [this.table, this.text, this.mem, this.cpu, this.net, this.log];
    }

    protected async renderWidget(box: any) {
        try {
            this.table = WidgetRender.table(box, 0, 0, "100%-2", "40%-2", "Containers");
            const data = await Dockerode.singleton.listContainers();
            this.table.setData(data);
            this.table.on("select", (container: any) => {
                this.showSelectContainer(container);
            });
        } catch (error) {
            Log.error(error);
        }

        this.text = WidgetRender.text(box, "40%-2", 0, "100%-2", 2, "{bold}✔  Container Stats{bold}");

        this.cpu = WidgetRender.line({ top: "40%", left: 0 }, "50%-1", "30%", "red", "CPU Usage (%)");
        box.append(this.cpu);
        this.mem = WidgetRender.line({ top: "40%", right: 0 }, "50%-1", "30%", "magenta", "Memory Usage (MB)");
        box.append(this.mem);
        this.net = WidgetRender.line({ left: 0, bottom: 0 }, "50%-1", "30%-1", "white", "Network Usage (KB)", true);
        box.append(this.net);
        this.log = WidgetRender.inspectBox(box, 0, 0, "50%-1", "30%-1", " Inspect ");
    }

    private async showSelectContainer(containerItem: any) {
        const selectId = containerItem.content.substring(0, 8);
        if (this.selectId == selectId) {
            return;
        }
        this.selectId = selectId;
        // clear data
        this.clearData();

        // show selected container id
        this.text.setContent("{bold}✔ Container Stats (" + selectId + "){bold}");
        this.refresh();

        const container = Dockerode.singleton.getContainer(selectId);
        if (!this.isRunning(selectId)) {
            return;
        }

        const inspectData = await container.inspect();
        this.log.setContent(inspectData);

        // start up draw the stats charts
        await this.showStatsCharts(container);
    }

    private clearData() {
        if (this.stream) {
            this.stream.end();
        }
        this.cpu.setData(Usage.EMPTY);
        this.mem.setData(Usage.EMPTY);
        this.net.setData(EMPTY_NET_DATA);
        this.log.setContent("");
    }

    private async showStatsCharts(container: any) {
        this.stream = await container.stat();
        this.stream.ondata((cpuuage: Usage, memUsage: Usage, txData: Usage, rxData: Usage) => {
            this.cpu.setData(cpuuage);
            this.mem.setData(memUsage);
            this.net.setData([txData, rxData]);
            this.refresh();
        });
    }

    private isRunning(selectId: string): boolean {
        if (this.table) {
            const row = this.table.rows.find((row: Array<string>) => row[0] === selectId);
            if (row) {
                return row[5].indexOf("running") >= 0;
            }
        }
        return false;
    }
}