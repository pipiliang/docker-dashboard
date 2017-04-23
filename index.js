#!/usr/bin/env node
 
var program = require('commander');
 
program
  .version('0.0.1')
  .option('ps', 'ps all')
  .parse(process.argv);
 
console.log('=>:');

if (program.ps) 
	console.log(' ps : show all active container instance ...');
else
	console.log(' dashboard here ');