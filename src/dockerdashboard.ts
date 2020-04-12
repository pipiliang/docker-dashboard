import { WidgetFactory } from "./widgets/widgetfactory";
import { Element } from "./api/element";
import { WidgetRender } from "./common/widgetrender";
import { Startable } from "./api/dashboard";
import { injectable } from "inversify";

@injectable()
export class DockerDashboard implements Startable {
	private dashboard: any;
	private widgetFactory: WidgetFactory;
	private activeElement: Element;
	private box: any;

	constructor() {
		this.dashboard = WidgetRender.screen("🐳 Docker Dashboard");
		this.dashboard.key(["q"], () => {
			return process.exit(0);
		});
		this.widgetFactory = new WidgetFactory(this);
		this.activeElement = this.widgetFactory.getDefault();
	}

	public startup() {
		WidgetRender.menuBar(this.dashboard, this.widgetFactory.getCommands());
		this.box = WidgetRender.box(this.dashboard);
		this.activeElement.render();
		this.dashboard.render();
	}

	public getBox() {
		return this.box;
	}

	public active(element: Element) {
		this.activeElement.hide();
		this.activeElement = element;
		this.activeElement.show();
		this.dashboard.render();
	}

	public getDashboard() {
		return this.dashboard;
	}
}
