#!/usr/bin/env node

import { DockerDashboard } from "./dockerdashboard";
const { Command } = require('commander');
const pkg = require('../package.json');
const program = new Command();

program
    .version(pkg.version)
    .parse(process.argv);

const app = new DockerDashboard();
app.startup();
