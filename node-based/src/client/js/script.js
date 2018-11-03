(function () {
    var socket = io();
    // var image = document.querySelector('#camera');
    // TODO - for Dev purpose. Remove post development!!
    var regionOfCapture = document.querySelector('#regionOfCapture');
    var scanner = document.getElementById('scanning-loader');
    var fan = document.getElementById('fan');
    var scannerStatus = document.getElementById('scannerStatus');
    let instructionPanels = $(".instruction");

    socket.on('startScan', function (data) {
        $(scanner).removeClass('stop');
        $(scanner).addClass('start');
        // scannerStatus.className = "scanner-text text-center";
    });
    socket.on('hand', function (data) {
        if(data) {
            instructionPanels.hide();
        } else {
            instructionPanels.show();
        }
    });
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