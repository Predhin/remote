var app = angular.module("gestureControl", []); 
app.controller("myCtrl", function($scope) {
	var socket = io();

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
});