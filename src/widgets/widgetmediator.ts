import { HomeWidget } from "./homewidget";
import { HelpWidget } from "./helpwidget";
import { DockerDashboard } from "../dockerdashboard";
import { ContainerWidget } from "./containerwidget";
import { Widget } from "./widget";
import { ImageWidget } from "./imagewidget";
import { NetworkWidget } from "./networkwidget";
import { VolumeWidget } from "./volumewideget";

export class WidgetMediator {
    private widgets: Array<Widget> = new Array<Widget>();

    constructor(dockerdashboard: DockerDashboard) {
        //todo DI
        this.widgets.push(new HomeWidget(dockerdashboard));
        this.widgets.push(new ContainerWidget(dockerdashboard));
        this.widgets.push(new ImageWidget(dockerdashboard));
        this.widgets.push(new NetworkWidget(dockerdashboard));
        this.widgets.push(new VolumeWidget(dockerdashboard));
        this.widgets.push(new HelpWidget(dockerdashboard));
    }

    public getCommands() {
        const commands: { [name: string]: any } = {};
        this.widgets.forEach(widget => {
            commands[widget.getCommandName()] = widget.getCommandKey();
        })
        return commands;
    }

    public getDefault(): Widget {
        return this.widgets[0];
    }
}