const url = require('url');

let server = {
  port: 3003
}

let mongo = {
  con: {
    protocol: 'mongodb',
    hostname: '127.0.0.1',
    port: '27017',
    pathname: 'quizbattle',
    slashes: true
  },
  auth: {
    username: "",
    password: ""
  },
  url: ''
}

if(mongo.auth.username && mongo.auth.password) {
  mongo.con.auth = `${mongo.auth.username}:${mongo.auth.password}`;
}

mongo.url = url.format(mongo.con);

module.exports = {
  server,
  mongo
}