import { ColorText } from "./color";
import { Log } from "./log";

const Docker = require('dockerode');
const moment = require('moment');

export class Dockerode {

    private static _instance: Dockerode;
    private docker: any;

    public static get instance(): Dockerode {
        if (!this._instance) {
            this._instance = new Dockerode();
        }
        return this._instance;
    }

    private constructor() {
        this.docker = new Docker({
            socketPath: '/var/run/docker.sock'
        });
    }

    public async version(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.docker.version()
                .then((version: any) => {
                    if (!version) {
                        reject([]);
                    }
                    const data = [[ColorText.title('Docker Version'), '']];
                    data.push([ColorText.blue('Docker version'), version.Version]);
                    data.push([ColorText.blue('Docker api version'), version.ApiVersion]);
                    data.push([ColorText.blue('Go version'), version.GoVersion]);
                    data.push([ColorText.blue('Build'), version.GitCommit]);
                    data.push([ColorText.blue('Build time'), version.BuildTime]);
                    data.push([ColorText.blue('Experimental'), version.Experimental ? version.Experimental : "--"]);
                    resolve(data);
                }).catch((ex: any) => {
                    Log.error(ex);
                    reject([]);
                })
        });
    }

    public async information(): Promise<any> {

        return new Promise((resolve, reject) => {
            const data: any[] = [];
            this.docker.info()
                .then((info: any) => {
                    if (!info) {
                        reject([])
                    }
                    const isSwarm = info.Swarm.LocalNodeState === 'active';
                    data.push(['', '']);
                    data.push([ColorText.title('Swarm Info'), '']);
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

                    resolve(data);
                }).catch((ex: any) => {
                    Log.error(ex);
                    reject(data);
                })
        });
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

    public async listImages(): Promise<any> {
        const data = [['Id', 'Repository', 'Tag', 'Size', 'Created']];
        return new Promise((resolve, reject) => {
            this.docker.listImages()
                .then((images: any) => {
                    if (!images) {
                        reject("image is null");
                        return;
                    }

                    images.forEach((image: any) => {
                        const row = [];
                        row.push(this.getId(image.Id));
                        const repoTag = this.getRepoTag(image.RepoTags);
                        row.push(repoTag.repo);
                        row.push(repoTag.tag);
                        row.push((image.Size / 1000 / 1000).toFixed(2) + 'MB');
                        row.push(moment(new Date(image.Created * 1000), 'YYYYMMDD').fromNow());

                        data.push(row);
                    });

                    resolve(data);
                }).catch((ex: any) => {
                    Log.info(ex);
                    reject(ex);
                })
        });
    }

    public async totalImages(): Promise<any> {
        const data = [['', '']];
        return new Promise((resolve, reject) => {
            this.docker.listImages()
                .then((images: any) => {
                    if (!images) {
                        reject("image is null");
                        return;
                    }
                    data.push([ColorText.title('Images'), '']);
                    data.push([ColorText.blue('Total'), images.length ? images.length.toString() : '0']);
                    data.push([ColorText.blue('Size'), this.sizeOf(images) + ' GB'])
                    resolve(data);
                }).catch((ex: any) => {
                    Log.info(ex);
                    reject(ex);
                })
        });
    }

    private getRepoTag(repoTags: any) {
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


    public async listContainers(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.docker.listContainers({ all: true })
                .then((containers: any) => {
                    if (!containers) {
                        reject([]);
                    }

                    const data = [['Id', 'Name', 'Image', 'IP', 'Ports', 'State']];
                    containers.forEach((container: any) => {
                        data.push(this.toRow(container));
                    });

                    resolve(data);
                }).catch((ex: any) => {
                    Log.error(ex);
                    reject([]);
                })
        });
    }

    private toRow(container: any) {
        var row = [];

        row.push(container.Id.substring(0, 8));
        if (container.Names.length > 0) {
            var name = container.Names[0];
            row.push(name.substring(1, name.length));
        } else {
            row.push('-');
        }
        row.push(container.Image);

        if (container.State == 'running') {
            var mode = container.HostConfig.NetworkMode;
            row.push(container.NetworkSettings.Networks[mode == 'default' ? 'bridge' : mode].IPAddress);
            if (container.Ports.length > 0) {
                var port = container.Ports[0];
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

    public async listNetworks(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.docker.listNetworks()
                .then((nets: any) => {
                    if (!nets) {
                        reject([]);
                    }
                    const data = [['Name', 'Id', 'Scope', 'Driver', 'IPAM Driver', 'IPAM Subnet', 'IPAM Gateway']];
                    nets.forEach((net: any) => {
                        const row = [];
                        row.push(net.Name);
                        row.push(net.Id);
                        row.push(net.Scope);
                        row.push(net.Driver);

                        if (!net.IPAM) {
                            row.push(net.IPAM.Driver);
                            if (net.IPAM.Config.length > 0) {
                                var c = net.IPAM.Config[0];
                                row.push(c.Subnet == null ? '-' : c.Subnet);
                                row.push(c.Gateway == null ? '-' : c.Gateway);
                            } else {
                                row.push('-');
                                row.push('-');
                            }
                        } else {
                            row.push('-');
                            row.push('-');
                            row.push('-');
                        }
                        data.push(row);
                    });
                    resolve(data);
                }).catch((ex: any) => {
                    Log.error(ex);
                    reject([]);
                })
        });
    }

    public async listVolumes(): Promise<any> {
        return new Promise((resolve, reject) => {
            const data = [['Name', 'Driver', 'Mountpoint']];
            this.docker.listVolumes()
                .then((result: any) => {
                    if (!result || !result.Volumes) {
                        reject(data);
                    }
                    result.Volumes.forEach((v: any) => {
                        var row = [];
                        row.push(v.Name);
                        row.push(v.Driver);
                        row.push(v.Mountpoint);
                        data.push(row);
                    });
                    resolve(data);
                }).catch((ex: any) => {
                    Log.error(ex);
                    reject(data);
                })
        });
    }

}