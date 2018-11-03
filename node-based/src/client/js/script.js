(function () {
    var socket = io();
    // var image = document.querySelector('#camera');
    // TODO - for Dev purpose. Remove post development!!
    var regionOfCapture = document.querySelector('#regionOfCapture');
    var scanner = document.getElementById('scanning-loader');
    var fan = document.getElementById('fan');
    var scannerStatus = document.getElementById('scannerStatus');

    socket.on('startScan', function (data) {
        $(scanner).removeClass('stop');
        $(scanner).addClass('start');
        // scannerStatus.className = "scanner-text text-center";
    });
    // TODO - for Dev purpose. Remove post development!!
    socket.on('captured-image', function (data) {
        regionOfCapture.src = 'data:image/png;base64,' + data;
    });
    socket.on('count', function (data) {
        document.getElementById("text").innerHTML = data;
        $(scanner).removeClass('start');
        $(scanner).addClass('stop');
        // scanner.className = "scan stop";
        // scannerStatus.className = "scanner-text text-center invisible";
        fan.className = "fan-leaf fan fa-spin " + data.toLowerCase();
    });
})();