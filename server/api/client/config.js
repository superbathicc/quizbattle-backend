const instancedir = require('../../../lib/instancedir')
const path = require('path');

module.exports.name = 'ClientAPI';
module.exports.repository = 'https://github.com/superbathicc/quizbattle-frontend';
module.exports.path = path.join(instancedir, 'client/');
module.exports.index = 'index.html';
module.exports.assets = 'assets/';