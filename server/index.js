const express = require('express');
const bodyParser = require('body-parser');
const os = require('os');
const api = require('./api');
const conf = require('../config');
const mongoose = require('mongoose');

let app = express();

async function init() {

  app.use((req, res, next) => {
    try {
      next();
    } catch(err) {
      next(err);
    }
  });

  app.use(bodyParser.json({
    type: 'application/json'
  }));

  app.use(bodyParser.urlencoded({
    extended: true,
    type: 'application/x-www-form-urlencoded'
  }));


  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    next();
  });

  api.use(app);

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if(typeof err === 'object' && err instanceof Error) {
      console.error(err);
    }
  });

  try {
    console.log('connecting to database');
    let mongo = await mongoose.connect(conf.mongo.url, {
      appname: 'backend',
      useNewUrlParser: true
    });
    console.log('connected to database', mongo.connection.db.databaseName);
  } catch(err) {
    console.error('failed connecting to database', err);
  }

  return await Promise.all(Object.entries(os.networkInterfaces())
    .map(entry => new Promise(async resolve => {
      console.log('initializing network interface: ' + entry[0]);

      resolve(await Promise.all(
        [].concat(...entry[1].map(iface =>
          new Promise((resolve, reject) => {
            let server = app
              .listen(conf.server.port, iface.address, (err) => {
                if(err) {
                  reject(err);
                  return;
                }

                console.log(`started listening on [${iface.family}] ${iface.address} port:${conf.server.port}`);
                resolve(server);
              });
          })))));
    })));
}

function runInit() {
  // eslint-disable-next-line no-unused-vars
  init().then((servers) => {
    console.log('server running');
  }).catch((err) => {
    console.error('an error occurred initializing the server.', err);
  });
}

module.exports.init = init;
module.exports.runInit = runInit;
