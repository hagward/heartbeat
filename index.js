var webSocketAddress = process.env.NODE_ENV === 'production'
        ? 'wss://heartbeat.deg17.net/receiver'
        : 'ws://localhost:8080/receiver';
var token = window.location.pathname;
var ws = new WebSocket(webSocketAddress + token);

var bpmSpan = document.getElementById('bpm');

ws.onmessage = function (event) {
    bpmSpan.innerText = event.data;
};

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
