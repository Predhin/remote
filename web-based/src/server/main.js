let io = {};
let http = {};
let app = {};
let express = {};
let Q = require('q');
let request = require('request');
process.env.NODE_CONFIG_DIR = __dirname + '/config';
const { home, control } = require('./controllers/iotController');

exports.run = (httpObj, ioObj, appObj, expressObj) => {
  http = httpObj;
  io = ioObj;
  app = appObj;
  express = expressObj;
  main();
};

function setupRoute() {

  app.get("/api", home);

  app.post("/api/control", control);
}

function setupSocket() {
  io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
      console.log('user disconnected');
    });
  });
}

function main() {
  setupSocket();
  setupRoute();
}
