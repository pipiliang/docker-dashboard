import { DockerDashboard } from "../dockerdashboard";
import { Widget } from "./widget";
import { WidgetHelper } from "../common/widgethelper";
import { Dockerode } from "../common/dockerode";
import { Logger } from "../common/logger";

export class NetworkWidget extends Widget {
    private netTable: any;

    constructor(dockerdashboard: DockerDashboard) {
        super(dockerdashboard);
    }

    getCommandName(): string {
        return 'Network';
    }

    getCommandKey() {
        return {
            keys: ['N'],
            callback: () => {
                this.render();
            }
        };
    }

    public hide() {
        this.netTable.hide();
    }
    public show() {
        this.netTable.show();
    }

    renderWidget(box: any) {
        this.netTable = WidgetHelper.renderTable(box, 0, 0, '100%-2', '100%-2', '');
        const data = [
            ['Name', 'Id', 'Scope', 'Driver', 'IPAM Driver', 'IPAM Subnet', 'IPAM Gateway']
        ];


        Dockerode.instance.listNetworks((err: any, networks: any) => {
            if (!networks) {
                return;
            }
            networks.forEach((net: any) => {

                // Logger.instance.info(net.Name + ' |' + net.Id + "|" + net.Scope + "|" + net.Driver);
                const row = [];
                row.push(net.Name);
                row.push(net.Id);
                row.push(net.Scope);
                row.push(net.Driver);
                // Logger.instance.info(net.IPAM);

                // { Driver: 'default',
                // Options: null,
                // Config: [ { Subnet: '172.17.0.0/16', Gateway: '172.17.0.1' } ] }

                // if (!net.IPAM) {
                //     row.push(net.IPAM.Driver);
                //     Logger.instance.info(net.IPAM.Driver);
                //     if (net.IPAM.Config.length > 0) {
                //         var c = net.IPAM.Config[0];
                //         row.push(c.Subnet == null ? '-' : c.Subnet);
                //         row.push(c.Gateway == null ? '-' : c.Gateway);
                //     } else {
                //         row.push('-');
                //         row.push('-');
                //     }
                // } else {
                    row.push('-');
                    row.push('-');
                    row.push('-');
                // }
                data.push(row);
            });
        });
        Logger.instance.info(data);
        // console.log(data);
        this.netTable.setData(data);
    }
}