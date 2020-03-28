import { DockerDashboard } from "../dockerdashboard";
import { Command } from "../api/command";
import { Element } from "../api/element";

export abstract class Widget implements Element, Command {

    private dockerdashboard: DockerDashboard;

    constructor(dockerdashboard: DockerDashboard) {
        this.dockerdashboard = dockerdashboard;
    }

    public abstract getCommandName(): string;

    public abstract getCommandKey(): { [key: string]: any };

    public abstract hide(): any;

    public abstract show(): any;

    protected abstract renderWidget(box: any): void;

    public async render() {
        await this.renderWidget(this.dockerdashboard.getBox());
    }

    protected active() {
        this.dockerdashboard.active(this);
    }

    protected refresh() {
        this.dockerdashboard.getDashboard().render();
    }
}