const {mkdirSync: mkdir, writeFileSync: write} = require('fs');
const {execSync: exec} = require('child_process');

exec('rm -rf aa');
exec('rm -rf node_modules/ab');
exec('rm -rf node_modules/ac');
mkdir('aa');
write('aa/package.json', '{"name": "aa", "version": "1.0.0"}');
write('aa/index.js', 'global.COUNT = global.COUNT ? global.COUNT + 1 : 1;');
mkdir('node_modules/ab');
write('node_modules/ab/package.json', '{"name": "ab", "version": "1.0.0", "dependencies": {"aa": "1.0.0"}}');
write('node_modules/ab/index.js', 'require("aa")');
mkdir('node_modules/ab/node_modules');
exec('ln -s ../../../aa/ aa', {cwd: 'node_modules/ab/node_modules'});
mkdir('node_modules/ac');
write('node_modules/ac/package.json', '{"name": "ac", "version": "1.0.0", "dependencies": {"aa": "1.0.0"}}');
write('node_modules/ac/index.js', 'require("aa")');
mkdir('node_modules/ac/node_modules');
exec('ln -s ../../../aa/ aa', {cwd: 'node_modules/ac/node_modules'});
