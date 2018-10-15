const app = require('express')();
const http = require('http').Server(app);
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
    io.emit('count', hand.numFingersUp);

  }
  return hand;
}

function run() {
  setUpServer();
  startCamera(action);
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
