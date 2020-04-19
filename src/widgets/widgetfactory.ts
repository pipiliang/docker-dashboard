import { Widget } from "./widget";
import { Element } from "../api/element";
import { injectable, multiInject } from "inversify";

@injectable()
export class WidgetFactory {
    private widgets: Array<Widget> = new Array<Widget>();

    constructor(@multiInject("Widget") widgets: Widget[]) {
        this.widgets = widgets;
    }

    public getCommands(): { [name: string]: any } {
        const commands: { [name: string]: any } = {};
        this.widgets.forEach(widget => {
            commands[widget.getCommandName()] = widget.getCommandKey();
        })
        return commands;
    }

    public getDefault(): Element {
        return this.widgets[0];
    }
}