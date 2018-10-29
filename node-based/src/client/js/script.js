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
        var scanner = document.getElementById('loader-scanner');
        if(data === "OFF") {            
            scanner.className = "loader-scanner stop";
        } else {
            scanner.className = "loader-scanner";
        }
    });
})();