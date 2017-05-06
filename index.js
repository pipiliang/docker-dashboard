#!/usr/bin/env node

 
var program = require('commander');
var dashboard = require('./container');
 
program
  .version('v0.1.3')
  .parse(process.argv);
