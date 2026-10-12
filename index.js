'use strict';
// Starts the shop:   node index.js
// 1) checks the Node.js version  2) loads the .env file if there is one  3) runs server.js
const path = require('path');

const [major, minor] = process.versions.node.split('.').map(Number);
if (major < 22 || (major === 22 && minor < 13)) {
  console.error('Node.js 22.13 or newer is required (this is ' + process.version + ').');
  process.exit(1);
}

// Variables set by the host (Railway "Variables" / Heroku "Config Vars") always win over the .env file.
// On the host you normally do not upload .env at all - paste its lines into the Variables panel instead.
try {
  process.loadEnvFile(path.join(__dirname, '.env'));
} catch (e) {
  if (e.code !== 'ENOENT') { console.error('Could not read the .env file: ' + e.message); process.exit(1); }
}

// Node prints a harmless "SQLite is an experimental feature" notice - hide just that one line.
const emitWarning = process.emitWarning;
process.emitWarning = function (warning, ...rest) {
  if (/sqlite/i.test(String((warning && warning.message) || warning))) return;
  return emitWarning.call(process, warning, ...rest);
};

require('./server.js');
