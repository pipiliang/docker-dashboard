import { ColorText } from "../color";
import { Log } from "../log";
import { Container } from "./container";

const Docker = require('dockerode');
const moment = require('moment');

export class Dockerode {

    private static instance: Dockerode;
    private docker: any;

    public static get singleton(): Dockerode {
        if (!this.instance) {
            this.instance = new Dockerode();
        }
        return this.instance;
    }

    private constructor() {
        this.docker = new Docker({
            socketPath: '/var/run/docker.sock'
        });
    }

    public getContainer(selectId: string): Container {
        return new Container(this.docker.getContainer(selectId));
    }

    public async version(): Promise<any> {
        const data = [[ColorText.title('Docker Version'), '']];
        try {
            const version = await this.docker.version();
            if (!version) {
                return data;
            }
            data.push([ColorText.blue('Docker version'), version.Version]);
            data.push([ColorText.blue('Docker api version'), version.ApiVersion]);
            data.push([ColorText.blue('Go version'), version.GoVersion]);
            data.push([ColorText.blue('Build'), version.GitCommit]);
            data.push([ColorText.blue('Build time'), version.BuildTime]);
            data.push([ColorText.blue('Experimental'), version.Experimental ? version.Experimental : "--"]);
        } catch (error) {
            Log.error(error);
            data.push(["Error", error.errno]);
        }
        return data;
    }

    public async information(): Promise<any> {
        const data: any[] = [['', ''], [ColorText.title('Swarm Info'), '']];
        try {
            const info = await this.docker.info();
            if (!info) {
                return data;
            }
            const isSwarm = this.isSwarm(info);
            if (isSwarm) {
                data.push([ColorText.blue('(This node is part of a Swarm cluster)'), '']);
            }
            data.push([ColorText.blue('Node role'), isSwarm ? this.role(info.Swarm) : '-']);
            data.push([ColorText.blue('Node id'), isSwarm ? info.Swarm.NodeID : '-']);
            data.push([ColorText.blue('Nodes in the cluster'), isSwarm ? info.Swarm.Nodes.toString() : '-']);
            data.push([ColorText.blue('Managers in the cluster'), isSwarm ? info.Swarm.Managers.toString() : '-']);

            data.push(['', '']);
            data.push([ColorText.title('Containers'), '']);
            data.push([ColorText.blue('Total'), info.Containers.toString()]);
            data.push([ColorText.blue('Running'), ColorText.cyan(info.ContainersRunning.toString())]);
            data.push([ColorText.blue('Stopped'), ColorText.red(info.ContainersStopped.toString())]);
            data.push([ColorText.blue('Paused'), ColorText.yellow(info.ContainersPaused.toString())]);
        } catch (error) {
            Log.error(error);
            data.push(["Error", error.errno]);
        }
        return data;
    }

    private isSwarm(info: any) {
        return info.Swarm && info.Swarm.LocalNodeState === 'active';
    }

    private role(swarm: any) {
        var localId = swarm.NodeID;
        var isLeader = false;
        swarm.RemoteManagers.forEach((rm: any) => {
            if (rm.NodeID == localId) {
                isLeader = true;
            }
        });
        return isLeader ? 'Leader' : 'Follower';
    }

    public async listImages() {
        const data = [['Id', 'Repository', 'Tag', 'Size', 'Created']];
        try {
            const images = await this.docker.listImages();
            if (!images) {
                return data;
            }
            images.forEach((image: any) => {
                const repoTag = this.getRepoTag(image.RepoTags);
                const size = (image.Size / 1000 / 1000).toFixed(2) + ' MB';
                const created = moment(new Date(image.Created * 1000), 'YYYYMMDD').fromNow();
                data.push([this.getId(image.Id), repoTag.repo, repoTag.tag, size, created]);
            });
        } catch (error) {
            Log.error(error);
        }
        return data;
    }

    public async totalImages(): Promise<any> {
        const data = [['', ''], [ColorText.title('Images'), '']];
        try {
            const images = await this.docker.listImages();
            if (!images) {
                return data;
            }
            data.push([ColorText.blue('Total'), images.length ? images.length.toString() : '0']);
            data.push([ColorText.blue('Size'), this.sizeOf(images) + ' GB'])
        } catch (error) {
            Log.error(error);
            data.push(["Error", error.errno]);
        }
        return data;
    }

    private getRepoTag(repoTags: any): { repo: string, tag: string } {
        const repo = {
            repo: '',
            tag: ''
        };
        if (repoTags && repoTags.length && repoTags.length > 0) {
            let tmp = repoTags[0].toString();
            let index = tmp.lastIndexOf(':');
            if (index >= 0) {
                repo.repo = tmp.substring(0, index);
                repo.tag = tmp.substring(index + 1, tmp.length);
            } else {
                repo.repo = tmp;
            }
        }
        return repo;
    }

    private getId(id: string): string {
        if (!id)
            return '-';
        let index = id.indexOf(':');
        if (index >= 0) {
            return id.substring(index + 1, index + 13);
        }
        return id.substring(0, 12);
    }

    private sizeOf(images: any): string {
        const total: number = images.reduce((total: number, image: any) => total + image.Size / 1000 / 1000, 0);
        return (total / 1000).toFixed(2);
    }


    public async listContainers() {
        const data = [['Id', 'Name', 'Image', 'IP', 'Ports', 'State']];
        try {
            const containers = await this.docker.listContainers({ all: true });
            if (!containers) {
                return data;
            }
            containers.forEach((container: any) => {
                data.push(this.toRow(container));
            });
        } catch (error) {
            Log.error(error);
        }
        return data;
    }

    private toRow(container: any) {
        const row = [];

        row.push(container.Id.substring(0, 8));
        if (container.Names.length > 0) {
            var name = container.Names[0];
            row.push(name.substring(1, name.length));
        } else {
            row.push('-');
        }
        row.push(container.Image);

        if (container.State == 'running') {
            let mode = container.HostConfig.NetworkMode;
            row.push(container.NetworkSettings.Networks[mode == 'default' ? 'bridge' : mode].IPAddress);
            if (container.Ports.length > 0) {
                let port = container.Ports[0];
                row.push(port.PrivatePort + ':' + port.PublicPort);
            } else {
                row.push('-');
            }
            row.push('{bold}{cyan-bg}{white-fg}running{/white-fg}{/cyan-bg}{/bold}');
        } else {
            row.push('-');
            row.push('-');
            row.push('{bold}{red-bg}{white-fg}stopped{/white-fg}{/red-bg}{/bold}');
        }
        return row;
    };

    public async listNetworks() {
        const data = [['Name', 'Id', 'Scope', 'Driver', 'IPAM Driver', 'IPAM Subnet', 'IPAM Gateway']];
        try {
            const nets = await this.docker.listNetworks();
            nets.forEach((net: any) => {
                const row = [net.Name, net.Id, net.Scope, net.Driver];
                if (!net.IPAM) {
                    row.push(net.IPAM.Driver);
                    if (net.IPAM.Config.length > 0) {
                        var c = net.IPAM.Config[0];
                        row.push(!c.Subnet ? '-' : c.Subnet);
                        row.push(!c.Gateway ? '-' : c.Gateway);
                    }
                }
                data.push(row);
            });
        } catch (error) {
            Log.error(error);
        }
        return data;
    }

    public async listVolumes() {
        const data = [['Name', 'Driver', 'Mountpoint']];
        try {
            const result = await this.docker.listVolumes();
            if (!result || !result.Volumes) {
                return data;
            }
            result.Volumes.forEach((volume: any) => data.push([volume.Name, volume.Driver, volume.Mountpoint]));
        } catch (error) {
            Log.error(error);
        }
        return data;
    }

}