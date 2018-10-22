let io = {};
let http = {};
let app = {};
let express = {};
let Q = require('q');
let request = require('request');
let Gpio = {};
let LED = {};
let pushButton = {};
process.env.NODE_CONFIG_DIR = __dirname + '/config';
const { home, control } = require('./controllers/iotController');

exports.run = (httpObj, ioObj, appObj, expressObj, GpioObj, LEDObj, pushButtonObj) => {
  http = httpObj;
  io = ioObj;
  app = appObj;
  express = expressObj;
  Gpio = GpioObj;
  LED = LEDObj;
  pushButton = pushButtonObj;
  main();
};

function setupRoute() {

  app.get("/api", home);

  app.post("/api/control", control);
}

function setupSocket() {
  io.on('connection', function (socket) {
    console.log('a user connected');
    var lightvalue = 0; //static variable for current status
    pushButton.watch(function (err, value) { //Watch for hardware interrupts on pushButton
      if (err) { //if an error
        console.error('There was an error', err); //output error message to console
        return;
      }
      lightvalue = value;
      socket.emit('light', lightvalue); //send button status to client
    });
    socket.on('light', function (data) { //get light switch status from client
      lightvalue = data;
      if (lightvalue != LED.readSync()) { //only change LED if status has changed
        LED.writeSync(lightvalue); //turn LED on or off
      }
    });
    socket.on('disconnect', function () {
      console.log('user disconnected');
    });
  });
}

function main() {
  setupSocket();
  setupRoute();
}
