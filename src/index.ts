#!/usr/bin/env node

import { DockerDashboard } from "./dockerdashboard";
const { Command } = require('commander');
const pkg = require('../package.json');
const program = new Command();

program
    .version(pkg.version)
    // .option('-e, --emoji', 'show emoji')
    .parse(process.argv);

// startup app
const dockerDashboader = new DockerDashboard();
if (program.emoji) {

} else {
    dockerDashboader.startup();
}
