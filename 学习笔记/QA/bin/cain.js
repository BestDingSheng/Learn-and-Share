#!/usr/bin/env node
 
/**
 * Module dependencies.
 */
 
var program = require('commander');
 


program
    .version('0.0.1')
    .option('-p, --peppers', 'Add peppers')
    .option('-P, --pineapple', 'Add pineapple')
    .option('-b, --bbq', 'Add bbq sauce')
    .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
    .parse(process.argv);

console.log('you ordered a pizza with:');
if (program.peppers) console.log('  - peppers');
if (program.pineapple) console.log('  - pineapple');
if (program.bbq) console.log('  - bbq');
console.log('  - %s cheese', program.cheese);

 
// program
//   .version('0.1.0')
//   .command('ding')
//   .action(function (dir, otherDirs) {
//     console.log('rmdir %s', dir);
//     if (otherDirs) {
//       otherDirs.forEach(function (oDir) {
//         console.log('rmdir %s', oDir);
//       });
//     }
//   });
 
program.parse(process.argv);