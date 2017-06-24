#!/usr/bin/env node

 
var program = require('commander');
var dashboard = require('./dashboard');
 
program
  .version('v0.1.4')
  .parse(process.argv);
