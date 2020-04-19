import { WidgetFactory } from "./widgets/widgetfactory";
import { Element } from "./api/element";
import { WidgetRender } from "./common/widgetrender";
import { injectable, inject } from "inversify";
import { Layout, Setup } from "./api/dashboard";

@injectable()
export class DockerDashboard {
	private widgetFactory: WidgetFactory;
	private layout: Setup;

	constructor(@inject("Setup") layout: Setup, @inject("WidgetFactory") widgetFactory: WidgetFactory) {
		this.layout = layout;
		this.widgetFactory = widgetFactory;
	}

	public startup() {
		this.layout.setMenu(this.widgetFactory.getCommands());
		this.layout.asDefault(this.widgetFactory.getDefault());
		this.layout.render();
	}
}

@injectable()
export class BoardLayout implements Layout, Setup {
	private screen: any;
	private box: any;
	private activeElement: Element;
	constructor() {
		this.screen = WidgetRender.screen("🐳 Docker Dashboard");
		this.screen.key(["q"], () => {
			return process.exit(0);
		});
		this.box = WidgetRender.box(this.screen);
	}

	setMenu(commands: { [key: string]: any }): void {
		WidgetRender.menuBar(this.screen, commands);
	}

	asDefault(element: Element) {
		this.activeElement = element;
		this.activeElement.render();
	}

	active(element: Element) {
		this.activeElement.hide();
		this.activeElement = element;
		this.activeElement.show();
		this.screen.render();
	}

	getBox(): any {
		return this.box;
	}

	getScreen(): any {
		return this.screen;
	}

	render() {
		this.screen.render();
	}

	onResize(callback: Function) {
		this.screen.on('resize', () => {
			callback();
		});
	}

}