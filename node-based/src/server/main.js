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
    // emit to socket
    io.emit('image', cv.imencode('.jpg', rawimg).toString('base64'));
    // TODO - for Dev purpose. Remove post development!!
    io.emit('captured-image', cv.imencode('.jpg', hand.capturedArea).toString('base64'))
    io.emit('count', hand.numFingersUp);
    // create a delta change based on two reference values
    let state = getSpeed(prevFingersUp, delta, hand.numFingersUp);
    if (READY_STATE && prevState !== state) {
      console.log("Finger count: " + hand.numFingersUp);
      console.log("Sending State: " + state);
      notifyIOTServer(state).then().finally(() => {
        READY_STATE = true;
      });
      prevState = state;
      READY_STATE = false;
    } else {
      // console.log('Current State :' + state + ' and Previous State  :' + prevState);
      // console.log("Ignoring gesture because IoT server is still processing request");
    }
    prevFingersUp = typeof hand.numFingersUp === 'number' || typeof hand.numFingersUp === 'string' ? parseInt(hand.numFingersUp) : 0;
  }
  return hand;
}

- function transformRequestBody(state) {
  let body = {};
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
  let url = config.get("remote").DEV;
  let body = {
    value: state
  };
  let options = {
    url,
    method: "POST",
    body,
    timeout: 1000,
    json: true
  };
  console.log("Webservice trigger: " + url);
  try {
    request(options, (err, resService, bodyService) => {
      console.log("Webservice acknowledged ");
      console.log(bodyService);
      if (err !== null || resService.statusCode.toString() !== "200") {
        console.log("Error");
        deferred.reject({ "status": resService ? resService.statusCode : 0, "message": "Error reaching IoT server." });
      } else {
        console.log("Success");
        perJson = bodyService;
        deferred.resolve(perJson);
      }
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
