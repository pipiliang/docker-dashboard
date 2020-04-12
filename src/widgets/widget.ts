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

    protected abstract getAllElements(): Array<any>;

    protected abstract renderWidget(box: any): void;

    /**
     * hide all elements of widget when click other widget
     */
    public hide(): void {
        this.getAllElements().forEach(element => { if (element) { element.hide(); } });
    }

    /**
     * show all elements of widget when click
     */
    public show(): void {
        this.getAllElements().forEach(element => { if (element) { element.show(); } });
        if (this.getAllElements().length > 0) {
            this.getAllElements()[0].focus();
        }
    }

    /**
     * resize all elements when screen resize
     */
    protected resize(): void {
        this.getAllElements().forEach(element => { if (element) { element.emit('attach'); } });
    }

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

}