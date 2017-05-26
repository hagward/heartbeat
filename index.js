var socket = require('socket.io-client')();

var room = window.location.pathname.substring(1);
var bpmSpan = document.getElementById('bpm');

socket.on('connect', function () {
    socket.emit('room', room);

    socket.on('message', function (data) {
        bpmSpan.innerText = data;
    });
});

var colorInputBg = document.getElementById('colorBg');
colorInputBg.value = '#333333';
colorInputBg.addEventListener('input', function (event) {
    document.body.style.background = event.target.value;
});

var colorInputFg = document.getElementById('colorFg');
colorInputFg.value = '#EFFEFF';
colorInputFg.addEventListener('input', function (event) {
    bpmSpan.style.color = event.target.value;
});
