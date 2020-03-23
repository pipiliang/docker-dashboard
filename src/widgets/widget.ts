import { DockerDashboard } from "../dockerdashboard";
import { WidgetHelper } from "../common/widgethelper";
import { Command } from "../commands/command";

export abstract class Widget implements Command {

    private dockerdashboard: DockerDashboard;
    private boxWidget: any;

    constructor(dockerdashboard: DockerDashboard) {
        this.dockerdashboard = dockerdashboard;
    }

    public abstract getCommandName(): string;

    public abstract getCommandKey(): any;

    public abstract hide(): any;

    public abstract show(): any;

    protected abstract renderWidget(box: any): any;

    public render() {
        this.renderWidget(this.dockerdashboard.getBox());
        this.dockerdashboard.active(this);
    }

    public getWidget() {
        return this.boxWidget;
    }

}