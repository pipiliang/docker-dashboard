
import { Usage, CPUUsage } from "../../../src/common/docker/container";
import { injectable, inject } from "inversify";

import * as mocha from 'mocha';
import * as chai from 'chai';

const expect = chai.expect;
describe('Usage Empty Data Test', () => {

    it('1. x array length of empty usage should be 0', () => {
        expect(Usage.EMPTY.x.length).to.equal(0);
    });

    it('2. y array length of empty usage should be 0', () => {
        expect(Usage.EMPTY.y.length).to.equal(0);
    });

});

describe('CPU Usage Test', () => {

    const stat = {
        read: "2020-04-07T13:26:54.666869645Z",
        cpu_stats:
        {
            cpu_usage:
            {
                total_usage: 553773915,
                percpu_usage: [""]
            },
            system_cpu_usage: 1228810000000
        },
        precpu_stats:
        {
            cpu_usage:
            {
                total_usage: 553773915
            },
            system_cpu_usage: 1227830000000
        }
    };

    const cpu = new CPUUsage();
    cpu.push(stat);

    it('1. x array length of empty usage should be 1', () => {
        expect(cpu.x.length).to.equal(1);
    });

    it('2. time should be correct', () => {
        expect(cpu.x[0]).to.equal('01:26:54');
    });

});