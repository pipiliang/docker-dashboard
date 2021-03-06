import { Color } from "../color";
import { Log } from "../log";
import { toLocalTime } from "../utils";

/**
 * the instance of container.
 */
export default class Container {

    private container: any;

    constructor(container: any) {
        this.container = container;
    }

    public async stat() {
        if (!this.container) {
            throw new Error("container is null.");
        }
        const stream = await this.container.stats();
        return new StatsStream(stream);
    }

    public async inspect() {
        if (!this.container) {
            throw new Error("container is null.");
        }
        try {
            const data = await this.container.inspect();
            return JSON.stringify(data, null, 2);
        } catch (error) {
            Log.error(error);
        }
        return "";
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
            const txData = new TXData();
            const rxData = new RXData();
            this.stream.on('data', (chunk: any) => {
                try {
                    const stat = JSON.parse(chunk.toString());
                    cpuUsage.push(stat);
                    memUsage.push(stat);
                    txData.push(stat);
                    rxData.push(stat);
                    callback(cpuUsage, memUsage, txData, rxData);
                } catch (error) {
                    Log.error(error);
                    // end stream when error happens
                    this.end();
                }
            });
        }
    }

    public end() {
        if (this.stream) {
            this.stream.emit('end');
        }
    }
}

export abstract class Usage {
    private readonly MAX_DATA_LENGTH = 20;
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

    protected shift() {
        if (this.y.length >= this.MAX_DATA_LENGTH) {
            this.y.shift();
        }
        if (this.x.length >= this.MAX_DATA_LENGTH) {
            this.x.shift();
        }
    }
}

/**
 * the usage class of CPU
 */
export class CPUUsage extends Usage {

    public push(stat: any): void {
        const time = toLocalTime(stat.read);
        let total = stat.cpu_stats.cpu_usage.total_usage - stat.precpu_stats.cpu_usage.total_usage;
        let system = stat.cpu_stats.system_cpu_usage - stat.precpu_stats.system_cpu_usage;
        let num = 1;
        if (stat.cpu_stats.cpu_usage.percpu_usage) {
            num = stat.cpu_stats.cpu_usage.percpu_usage.length;
        }

        if (system > 0.0) {
            let percent = (total / system) * num * 100;
            this.shift()
            this.y.push(percent);
            Log.info(time);
            this.x.push(time);
        }
    }

}

export class RXData extends Usage {

    public get title() {
        return "RX";
    }

    public get style() {
        return {
            line: Color.magenta
        };
    }

    public push(stat: any): void {
        const time = toLocalTime(stat.read);
        let preValue = 0;
        if (this.y.length > 0) {
            preValue = this.y[this.y.length - 1];
        }

        var rxData = (stat.networks.eth0.rx_bytes - preValue) / 1024;
        this.shift()
        this.y.push(Number(rxData.toFixed(0)));
        this.x.push(time);
    }

}

export class TXData extends Usage {

    public get title() {
        return "TX";
    }

    public get style() {
        return {
            line: Color.yellow
        };
    }

    public push(stat: any): void {
        const time = toLocalTime(stat.read);
        let preValue = 0;
        if (this.y.length > 0) {
            preValue = this.y[this.y.length - 1];
        }

        var txData = (stat.networks.eth0.tx_bytes - preValue) / 1024;
        this.shift()
        this.y.push(Number(txData.toFixed(0)));
        this.x.push(time);
    }

}

export const EMPTY_NET_DATA = [new RXData(), new TXData()];

/**
 * the usage class of Memory
 */
export class MemoryUsage extends Usage {

    public push(stat: any): void {
        this.shift()
        const time = toLocalTime(stat.read);
        this.y.push(stat.memory_stats.usage / 1024 / 1024);
        this.x.push(time);
    }

}
