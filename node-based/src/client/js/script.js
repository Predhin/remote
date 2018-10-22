(function () {
    var socket = io();
    // var image = document.querySelector('#camera');
    // TODO - for Dev purpose. Remove post development!!
    var regionOfCapture = document.querySelector('#regionOfCapture');

    socket.on('image', function (data) {
        // image.src = 'data:image/png;base64,' + data;
    });
    // TODO - for Dev purpose. Remove post development!!
    socket.on('captured-image', function (data) {
        regionOfCapture.src = 'data:image/png;base64,' + data;
    });
    socket.on('count', function (data) {
        document.getElementById("text").innerHTML = data;
    });

    /*function callLED(state) {
      var API_URL = `http://192.168.43.147/D0/${state}?`;
      isPromiseActive = true;
      fetch(API_URL).then(function (response) { // we assume we will get a response!!
        isPromiseActive = false;
        return response.json();
      }).then(function (data) {
        isPromiseActive = false;
      });
    };*/
})();