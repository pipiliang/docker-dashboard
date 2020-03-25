import { DockerDashboard } from "../dockerdashboard";
import { Command } from "../api/command";
import { Render } from "../api/render";

export abstract class Widget implements Render, Command {

    private dockerdashboard: DockerDashboard;

    constructor(dockerdashboard: DockerDashboard) {
        this.dockerdashboard = dockerdashboard;
    }

    public abstract getCommandName(): string;

    public abstract getCommandKey(): any;

    public abstract hide(): any;

    public abstract show(): any;

    protected abstract renderWidget(box: any): void;

    public async render() {
        await this.renderWidget(this.dockerdashboard.getBox());
    }

    public active() {
        this.dockerdashboard.active(this);
    }
}