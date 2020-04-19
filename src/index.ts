#!/usr/bin/env node

import "reflect-metadata";
import { ioc } from "./ioc/inversify.config";
import { DockerDashboard } from "./dockerdashboard";
import { Command } from "commander";

const pkg = require('../package.json');
const program = new Command();

program
    .version(pkg.version)
    .parse(process.argv);

const app = ioc.get<DockerDashboard>("DockerDashboard");
app.startup();