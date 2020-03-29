import { DockerDashboard } from "../dockerdashboard";
import { Widget } from "./widget";
import { WidgetRender } from "../common/widgetrender";

export class HelpWidget extends Widget {
    private helpBox: any;

    constructor(dockerdashboard: DockerDashboard) {
        super(dockerdashboard);
    }

    getCommandName(): string {
        return "Help";
    }

    getCommandKey(): { [key: string]: any } {
        return {
            keys: ["h"],
            callback: () => {
                if (!this.helpBox) {
                    this.render();
                }
                this.active();
            }
        };
    }

    public hide() {
        this.helpBox.hide();
    }

    public show() {
        this.helpBox.show();
    }

    renderWidget(box: any) {
        const content = '\n' +
            '   Shortcut\n' +
            '   -----------------------------------------------------------------\n' +
            '   D       :  show node info.\n' +
            '   C       :  show container list.\n' +
            '   I       :  show iamge list.\n' +
            '   N       :  show network.\n' +
            '   V       :  show volume list.\n' +
            '   H       :  show help.\n' +
            '   Q       :  exit.\n' +
            '   \n' +
            '   About\n' +
            '   -----------------------------------------------------------------\n' +
            '   Github  :  https://github.com/pipiliang/docker-dashboard\n' +
            '   Issues  :  https://github.com/pipiliang/docker-dashboard/issues\n' +
            '   Lisence :  MIT\n' +
            '   Thanks  :  \n' +
            '              1. blessed \n' +
            '              2. blessed-contrib \n' +
            '              3. dockerode';
        this.helpBox = WidgetRender.helpBox(box, content);
    }
    // 🗻 🐞️ 🔑  🙏️
}