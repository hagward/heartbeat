var socket = require('socket.io-client')();

var room = window.location.pathname.substring(1);
var heartSvg = document.getElementById('heart');
var bpmSpan = document.getElementById('bpm');
var animationDuration;

socket.on('connect', function () {
    socket.emit('room', room);

    socket.on('message', function (data) {
        bpmSpan.innerText = data;
        animationDuration = (60/data).toPrecision(3) + 's';
    });
});

heartSvg.addEventListener('animationiteration', function () {
    heartSvg.style.animationDuration = animationDuration;
});

var colorInputBgBody = document.getElementById('colorBgBody');
colorInputBgBody.value = '#333333';
colorInputBgBody.addEventListener('input', function (event) {
    document.body.style.background = event.target.value;
});

var colorInputFgHeart = document.getElementById('colorFgHeart');
colorInputFgHeart.value = '#FF0000';
colorInputFgHeart.addEventListener('input', function (event) {
    heartSvg.style.fill = event.target.value;
});

var colorInputFgText = document.getElementById('colorFgText');
colorInputFgText.value = '#EFFEFF';
colorInputFgText.addEventListener('input', function (event) {
    bpmSpan.style.color = event.target.value;
});
