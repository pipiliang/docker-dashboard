const Docker = require('dockerode')


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

    public version() {
        return this.docker.version();
    }

    public listNetworks(callback: any) {
        return this.docker.listNetworks(callback);
    }

    public listVolumes(callback: any) {
        return this.docker.listVolumes(callback);
    }

}