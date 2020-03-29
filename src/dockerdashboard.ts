import { WidgetFactory } from "./widgets/widgetfactory";
import { Element } from "./api/element";
import { WidgetRender } from "./common/widgetrender";

export class DockerDashboard {
	private dashboard: any;
	private widgetFactory = new WidgetFactory(this);
	private activeElement = this.widgetFactory.getDefault();
	private box: any;

	constructor() {
	}

	public startup() {
		this.dashboard = WidgetRender.form("🐳 Docker Dashboard");
		this.dashboard.key(["q"], () => {
			return process.exit(0);
		});

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
