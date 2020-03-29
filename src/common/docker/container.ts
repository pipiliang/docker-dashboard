import { Log } from "../log";

export class Usage {
    private X = [""];
    private Y = [1];

    public get x() {
        return this.X;
    }

    public get y() {
        return this.Y;
    }
}

export class Container {

    private container: any;

    constructor(container: any) {
        this.container = container;
    }

    public stats(callback: any) {
        if (!this.container) {
            Log.info("container is null.");
            return;
        }

        const cpu = new Usage();
        this.container.stats().then((stream: any) => {
            if (stream) {
                stream.on('data', (chunk: any) => {
                    Log.info(chunk);
                    const stat = JSON.parse(chunk.toString());
                    const time = stat.read.substring(12, 19);
                    this.calCPUUsage(cpu, stat, time);
                    callback(cpu);
                });
            }
        }).catch((error: any) => {
            Log.error(error);
        });
    }

    private calCPUUsage(cpu: Usage, stat: any, time: string) {
        let total = stat.cpu_stats.cpu_usage.total_usage - stat.precpu_stats.cpu_usage.total_usage;
        let system = stat.cpu_stats.system_cpu_usage - stat.precpu_stats.system_cpu_usage;
        let num = stat.cpu_stats.cpu_usage.percpu_usage.length;

        if (system > 0.0 && total > 0.0) {
            let percent = (total / system) * num * 100;
            if (cpu.y.length >= 30) {
                cpu.y.shift();
                cpu.x.shift();
            }
            cpu.y.push(percent);
            cpu.x.push(time);
        }
    }

}