const {spawn} = require('child_process');
const process = require('process');
const instancedir = require('../../../lib/instancedir');
const shell = require('shelljs');
const fs = require('fs-extra');
const path = require('path');

/**
 * 
 * @typedef {object} CloneRepositoryOptions
 * @prop {string} target
 * @param {string} url 
 * @param {CloneRepositoryOptions} options 
 */
async function cloneRepository(url, options) {
  let cp = spawn('git', [
    'clone',
    url
  ], {
    cwd: instancedir
  });

  let out = '';
  cp.stderr.on('data', chunk => {
    out += chunk.toString('utf-8');
    process.stderr.write('git: ' + chunk.toString('utf-8'));
  })

  cp.stdout.on('data', chunk => {
    process.stdin.write('git: ') + chunk.toString('utf-8');
  })

  return await new Promise((resolve, reject) => {
    cp.on('exit', (code) => {
      if(code > 0) {
        reject(new Error('git exited with non zero code'));
        return;
      }

      let cloneDirnamePat = /^[\S\s]*?Cloning into '([a-zA-Z-]*?)'[\S\s]*$/gm
      let clonedDirname = cloneDirnamePat.exec(out)[1];
      let clonedPath = path.join(instancedir, clonedDirname);

      if(typeof options === 'object' && typeof options !== null) {
        if(typeof options.target === 'string') {
          try {
            fs.moveSync(clonedPath, options.target);
          } catch(err) {
            reject(err);
          }
          resolve(options.target);
          return;
        }
      }

      resolve(clonedPath);
    });
  });
}

module.exports.cloneRepository = cloneRepository;

async function pullRepository(p) {
  let cp = spawn('git', ['pull'], {
    cwd: p
  });

  return await new Promise((resolve, reject) => {
    cp.on('exit', (code) => {
      if(code > 0) {
        reject(new Error('git exited with non zero code'));
        return;
      }

      resolve();
    });
  });
}

module.exports.pullRepository = pullRepository;