const app = require('express')();
let http = require('http').Server(app);
http = require('http-shutdown')(http);
const io = require('socket.io')(http);
const {
  cv
} = require('./utils');
const { startCamera } = require('./webcam/webcamDetection');
const { handDetection } = require('./handGesture/handGestureRecognition');
function action(img, rawimg) {
  let hand = handDetection(img);
  // console.log(cv);
  if (hand) {
    console.log(hand.numFingersUp);
    // emit to socket
    io.emit('image', cv.imencode('.jpg', rawimg).toString('base64'));
    // TODO - for Dev purpose. Remove post development!!
    io.emit('captured-image', cv.imencode('.jpg', hand.capturedArea).toString('base64'))
    io.emit('count', hand.numFingersUp);

  }
  return hand;
}

function run() {
  cleanUp();
  setUpServer();
  startCamera(action);
}

function cleanUp() {
  process.stdin.resume();//so the program will not close instantly

  function exitHandler(options, exitCode) {
    if (options.cleanup) console.log('clean');
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();
    // shutdown the server.
    http.shutdown(function () {
      console.log('Everything is cleanly shutdown.');
    });
  }

  //do something when app is closing
  process.on('exit', exitHandler.bind(null, { cleanup: true }));

  //catches ctrl+c event
  process.on('SIGINT', exitHandler.bind(null, { exit: true }));

  // catches "kill pid" (for example: nodemon restart)
  process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
  process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

  //catches uncaught exceptions
  process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
}

function setUpServer() {
  console.log("Setting up proxy server");
  app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
  });

  io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
      console.log('user disconnected');
    });
  });

  // create server
  http.listen(2000, function () {
    console.log('listening on localhost:2000');
  });

}

run();
