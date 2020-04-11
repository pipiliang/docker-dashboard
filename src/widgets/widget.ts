import { DockerDashboard } from "../dockerdashboard";
import { Command } from "../api/command";
import { Element } from "../api/element";

export abstract class Widget implements Element, Command {

    private dockerdashboard: DockerDashboard;

    constructor(dockerdashboard: DockerDashboard) {
        this.dockerdashboard = dockerdashboard;
        this.dockerdashboard.getDashboard().on('resize', () => {
            this.resize();
        });
    }

    public abstract getCommandName(): string;

    public abstract getCommandKey(): { [key: string]: any };

    public abstract hide(): any;

    public abstract show(): any;

    protected abstract renderWidget(box: any): void;

    protected abstract resize() : void;

    public async render() {
        await this.renderWidget(this.dockerdashboard.getBox());
        this.refresh();
    }

    protected active() {
        this.dockerdashboard.active(this);
    }

    protected refresh() {
        this.dockerdashboard.getDashboard().render();
    }

    protected showAll(...widgets: any[]) {
        widgets.forEach(widget => { if (widget) { widget.show(); } });
    }

    protected hideAll(...widgets: any[]) {
        widgets.forEach(widget => { if (widget) { widget.hide(); } });
    }

}