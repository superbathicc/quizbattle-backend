const fs = require('fs');
const path = require('path');

let name = path.join(__dirname, '../.instance');

module.exports = name;

if(!fs.existsSync(name)) {
  fs.mkdirSync(name);
}