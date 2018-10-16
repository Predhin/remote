let io = {};
let http = {};
const {
  cv
} = require('./utils');
const { startCamera } = require('./webcam/webcamDetection');
const { handDetection } = require('./handGesture/handGestureRecognition');

exports.run = (httpObj, ioObj) => {
  http = httpObj;
  io = ioObj;
  setupSocket();
  main();
};
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

function setupSocket() {
  io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
      console.log('user disconnected');
    });
  });
}

function main() {
  startCamera(action);
}
