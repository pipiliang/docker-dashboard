import { ColorText } from "../color";
import { Log } from "../log";
import { toLocalDateTime, fromNow } from "../utils"
import Container from "./container";
import Image from "./image";

const Docker = require('dockerode');

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

    public getImage(selectId: string): Image {
        return new Image(this.docker.getImage(selectId));
    }

    /**
     * get docker version.
     */
    public async getDockerVersion(): Promise<string[][]> {
        const data = [];
        try {
            const version = await this.docker.version();
            if (!version) {
                return data;
            }
            data.push(['Docker version', version.Version]);
            data.push(['Docker api version', version.ApiVersion]);
            data.push(['Go version', version.GoVersion]);
            data.push(['Build', version.GitCommit]);
            data.push(['Build time', toLocalDateTime(version.BuildTime)]);
        } catch (error) {
            Log.error(error);
            data.push(['Error', error.errno]);
        }
        return data;
    }

    public async getStatistics(): Promise<string[][]> {
        const data = [['Containers', 'Images', 'Networks', 'Volumes']];
        try {
            const info = await this.docker.info();
            if (!info) {
                return data;
            }
            const running = 'Running : ' + ColorText.cyan(info.ContainersRunning.toString());
            const stopped = 'Stopped : ' + ColorText.red(info.ContainersStopped.toString());
            const containers = info.Containers.toString() + ' ( ' + running + ' , ' + stopped + ' )';
            const images = await this.totalImages();
            const nets = await this.statistic(() => this.docker.listNetworks());
            const volumes = await this.statistic(async () => {
                const result = await this.docker.listVolumes();
                if (result) {
                    return result.Volumes;
                }
            });

            data.push([containers, images, nets, volumes])
        } catch (error) {
            Log.error(error);
            data.push([error.errno]);
        }
        return data;
    }

    private async statistic(callback: Function): Promise<string> {
        try {
            const result = await callback();
            if (!result) {
                return '-';
            }
            return result.length ? result.length.toString() : '0';
        } catch (error) {
            Log.error(error);
            return error.errno;
        }
    }

    // total of images
    private async totalImages(): Promise<string> {
        try {
            const images = await this.docker.listImages();
            if (!images) {
                return '-';
            }
            const length = images.length ? images.length.toString() : '0';
            return length + ' ( Size : ' + this.sizeOf(images) + ' GB )';
        } catch (error) {
            Log.error(error);
            return error.errno;
        }
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
                const created = fromNow(image.Created);
                data.push([this.getId(image.Id), repoTag.repo, repoTag.tag, size, created]);
            });
        } catch (error) {
            Log.error(error);
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
                const ports = container.Ports.map(port => port.PrivatePort + ':' + port.PublicPort).join(' ');
                row.push(ports.toString());
            } else {
                row.push('-');
            }
            row.push(ColorText.RUNNING);
        } else {
            row.push('-');
            row.push('-');
            row.push(ColorText.state(container.State));
        }
        return row;
    };

    public async listNetworks() {
        const data = [['Name', 'Scope', 'Driver', 'Internal', 'IPAM Driver', 'IPAM Subnet', 'IPAM Gateway']];
        try {
            const nets = await this.docker.listNetworks();
            nets.forEach((net: any) => {
                const row = [net.Name, net.Scope, net.Driver, net.Internal];
                if (net.IPAM) {
                    row.push(net.IPAM.Driver);
                    if (net.IPAM.Config.length > 0) {
                        var c = net.IPAM.Config[0];
                        row.push(!c.Subnet ? '-' : c.Subnet.trim());
                        row.push(!c.Gateway ? '-' : c.Gateway.trim());
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

    /**
     * monitor stream real-time events from the docker server
     */
    public async monitor(change: Function) {
        try {
            const stream = await this.docker.getEvents();
            stream.on('data', (chunk: any) => {
                const event = JSON.parse(chunk.toString());
                Log.info(event);
                if (event.Type === 'container' && (event.Action === 'start' || event.Action === 'stop'
                    || event.Action === 'create' || event.Action === 'destroy' || event.Action === 'rename'
                    || event.Action === 'die')) {
                    change();
                }
            });
        } catch (error) {
            Log.error(error);
        }
    }

}
