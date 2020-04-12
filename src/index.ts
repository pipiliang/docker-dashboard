#!/usr/bin/env node

import "reflect-metadata";
import { ioc } from "./ioc/inversify.config";
import { Startable } from "./api/dashboard";
const { Command } = require('commander');
const pkg = require('../package.json');
const program = new Command();

program
    .version(pkg.version)
    .parse(process.argv);

const app = ioc.get<Startable>("Startable");
app.startup();