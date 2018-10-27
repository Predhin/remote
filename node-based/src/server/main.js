let io = {};
let http = {};
let Q = require('q');
let request = require('request');
process.env.NODE_CONFIG_DIR = __dirname + '/config';
let config = require("config");
const {
  cv
} = require('./utils');
const { startCamera } = require('./webcam/webcamDetection');
const { handDetection } = require('./handGesture/handGestureRecognition');
const { getSpeed } = require('./compute');

let READY_STATE = true;
let delta = [];
let prevFingersUp = 0;
let prevState;
let actionCounter = 0;
let hand;

exports.run = (httpObj, ioObj) => {
  http = httpObj;
  io = ioObj;
  setupSocket();
  main();
};
function action(img, rawimg) {
  let originalResizedImg = img.copy().getRegion(new cv.Rect(100, 100, 300, 300));
  io.emit('captured-image', cv.imencode('.jpg', originalResizedImg).toString('base64'));
  if (actionCounter % 10 === 0) {
    hand = handDetection(img);
    console.log('Hand Logic');
    // console.log(cv);    
    if (hand) {
      let state = getSpeed(prevFingersUp, delta, hand.numFingersUp);
      // emit fan speed to socket
      io.emit('count', state);
      if (READY_STATE && prevState !== state) {
        console.log("Finger count: " + hand.numFingersUp);
        console.log("Sending State: " + state);
        notifyIOTServer(state).then().finally(() => {
          READY_STATE = true;
        });
        prevState = state;
        READY_STATE = false;
      } 
      prevFingersUp = typeof hand.numFingersUp === 'number' || typeof hand.numFingersUp === 'string' ? parseInt(hand.numFingersUp) : 0;
    }
  }
  actionCounter++;
  return hand;
}

function transformRequestUrl(state) {
  let url = config.get("remote").LOCAL;
  switch (state) {
    case "HIGH":
      url = url + "D3/OFF?";
      break;
    case "MEDIUM":
      url = url + "D2/OFF?";
      break;
    case "LOW":
      url = url + "D1/OFF?";
      break;
    case "OFF":
      url = url + "D0/OFF?";
      break;
    default:
      url = url + "D0/OFF?";
  }
  return url;
}

function notifyIOTServer(state) {
  let deferred = Q.defer();
  let url = transformRequestUrl(state);
  let options = {
    url,
    method: "GET",
    timeout: 1000
  };
  console.log("Webservice trigger: " + url);
  try {
    request(options, (err, resService, bodyService) => {
      console.log("Webservice acknowledged ");
      if (err !== null || resService.statusCode.toString() !== "200") {
        console.log("Error");
        deferred.reject({ "status": resService ? resService.statusCode : 0, "message": "Error reaching IoT server." });
      }
      console.log("Success");
      perJson = bodyService;
      deferred.resolve(perJson);
    });
  }
  catch (err) {
    console.log("Error");
    deferred.reject(err);
  }
  return deferred.promise;
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
