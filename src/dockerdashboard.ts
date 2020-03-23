import { WidgetMediator } from "./widgets/widgetmediator";
import { Widget } from "./widgets/widget";

const blessed = require('blessed');

export class DockerDashboard {
	private dashboard: any;
	private widgetMediator = new WidgetMediator(this);
	private activeWidget = this.widgetMediator.getDefault();
	private box: any;

	constructor() {
	}

	public startup() {
		this.initDashboard();
		this.registerExitKey();
		this.renderListBar();
		this.initBox();
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

	private initDashboard() {
		this.dashboard = blessed.screen({
			smartCSR: true,
			fullUnicode: true,
			autoPadding: true,
			title: '🐳 Docker Dashboard'
		});
	}

	private registerExitKey() {
		this.dashboard.key(['q', 'C-c'], (ch: any, key: any) => {
			return process.exit(0);
		});
	}

	private renderListBar() {
		var bar = blessed.listbar({
			parent: this.dashboard,
			top: 0,
			left: 0,
			right: 0,
			height: 'shrink',
			mouse: true,
			keys: true,
			autoCommandKeys: true,
			border: 'line',
			vi: true,
			style: {
				bg: 'black',
				item: {
					bg: 'yellow',
					fg: 'black',
					hover: {
						bg: 'blue'
					}
				},
				selected: {
					bg: 'blue'
				}
			},
			commands: this.widgetMediator.getCommands()
		});
		bar.focus();
		this.dashboard.append(bar);
	}

	private initBox() {
		this.box = blessed.box({
			parent: this.dashboard,
			align: 'center',
			scrollable: true,
			scrollstep: 1,
			left: 0,
			top: 2,
			width: '100%',
			height: 'shrink',
			border: {
				type: "line",
				fg: 0
			},
			alwaysScroll: false,
			scrollbar: {
				ch: ' '
			}
		});
	}
}
