import { DockerDashboard } from "../dockerdashboard";
import { Command } from "../api/command";
import { Render } from "../api/render";

export abstract class Widget implements Render, Command {

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
        this.dockerdashboard.getDashboard().render();
    }

    public getWidget() {
        return this.boxWidget;
    }

}