import { WidgetFactory } from "./widgets/widgetfactory";
import { Widget } from "./widgets/widget";
import { WidgetRender } from "./common/widgetrender";

export class DockerDashboard {
	private dashboard: any;
	private widgetMediator = new WidgetFactory(this);
	private activeWidget = this.widgetMediator.getDefault();
	private box: any;

	constructor() {
	}

	public startup() {
		this.dashboard = WidgetRender.form('🐳 Docker Dashboard');
		this.dashboard.key(['q', 'C-c'], () => {
			return process.exit(0);
		});

		WidgetRender.menuBar(this.dashboard, this.widgetMediator.getCommands());
		this.box = WidgetRender.box(this.dashboard);

		this.activeWidget.render();
		this.dashboard.render();
	}

	public getBox() {
		return this.box;
	}

	public active(widget: Widget) {
		this.activeWidget.hide();
		this.activeWidget = widget;
		this.activeWidget.show();
		this.dashboard.render();
	}

	public getDashboard() {
		return this.dashboard;
	}
}
