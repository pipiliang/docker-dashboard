#!/usr/bin/env node

import { DockerDashboard } from "./dockerdashboard";
const { Command } = require('commander');

const program = new Command();
program
    .version('v0.1.4')
    .option('-e, --emoji', 'show emoji')
    .parse(process.argv);

// startup app
const dockerDashboader = new DockerDashboard();
if (program.emoji) {
    console.log(program.emoji);
} else {
    dockerDashboader.startup();
}
