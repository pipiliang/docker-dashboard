import { Log } from "../log";

export abstract class Usage {
    private X = new Array<string>();
    private Y = new Array<number>();
    public static EMPTY = { x: [], y: [] };

    public get x() {
        return this.X;
    }

    public get y() {
        return this.Y;
    }

    abstract push(stat: any): void;
}

/**
 * the usage class of CPU
 */
export class CPUUsage extends Usage {

    public push(stat: any): void {
        const time = stat.read.substring(11, 19);
        let total = stat.cpu_stats.cpu_usage.total_usage - stat.precpu_stats.cpu_usage.total_usage;
        let system = stat.cpu_stats.system_cpu_usage - stat.precpu_stats.system_cpu_usage;
        let num = stat.cpu_stats.cpu_usage.percpu_usage.length;

        if (system > 0.0 && total > 0.0) {
            let percent = (total / system) * num * 100;
            if (this.y.length >= 30) {
                this.y.shift();
                this.x.shift();
            }
            this.y.push(percent);
            this.x.push(time);
        }
    }

}

/**
 * the usage class of Memory
 */
export class MemoryUsage extends Usage {

    public push(stat: any): void {
        const time = stat.read.substring(11, 19);
        const usage = stat.memory_stats.usage / 1024 / 1024;

        if (this.y.length >= 30) {
            this.y.shift();
            this.x.shift();
        }
        this.y.push(usage);
        this.x.push(time);
    }

}

/**
 * the instance of container.
 */
export class Container {

    private container: any;

    constructor(container: any) {
        this.container = container;
    }

    public async stat(): Promise<StatsStream> {
        if (!this.container) {
            throw new Error("container is null.");
        }
        const stream = await this.container.stats();
        return new StatsStream(stream);
    }
}

/**
 * the stream of docker stats
 */
export class StatsStream {
    private stream: any;

    constructor(stream: any) {
        this.stream = stream;
    }

    public ondata(callback: any) {
        if (this.stream) {
            const cpuUsage = new CPUUsage();
            const memUsage = new MemoryUsage();
            this.stream.on('data', (chunk: any) => {
                const stat = JSON.parse(chunk.toString());
                cpuUsage.push(stat);
                memUsage.push(stat);
                callback(cpuUsage, memUsage);
            });
        }
    }

    public end() {
        if (this.stream) {
            this.stream.emit('end');
        }
    }
}