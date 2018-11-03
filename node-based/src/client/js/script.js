(function () {
    const socket = io();
    const regionOfCapture = document.querySelector('#regionOfCapture');
    const scanner = document.getElementById('scanning-loader');
    const fan = document.getElementById('fan');
    const scannerStatus = document.getElementById('scannerStatus');
    const scannerContainer = $("#scanning-container");
    const instructionPanels = $(".instruction");
    const detectionContainer = $('#detection');
    detectionContainer.hide();

    socket.on('startScan', function (data) {
        $(scanner).removeClass('stop');
        $(scanner).addClass('start');
        scannerContainer.show();
        // detectionContainer.hide();
    });
    socket.on('hand', function (data) {
        if(data) {
            instructionPanels.hide();
            scannerContainer.show();
        } else {
            instructionPanels.show();
            // detectionContainer.hide();
            scannerContainer.hide();
        }
    });
    socket.on('captured-image', function (data) {
        regionOfCapture.src = 'data:image/png;base64,' + data;
    });
    socket.on('count', function (data) {
        document.getElementById("text").innerHTML = data;
        $(scanner).removeClass('start');
        $(scanner).addClass('stop');
        scannerContainer.hide();
        detectionContainer.show();
        
        fan.className = "fan-leaf fan fa-spin " + data.toLowerCase();
    });
})();