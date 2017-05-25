const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const clients = {}
const tokens = {}

app.use('/node_modules', express.static('node_modules'))
app.use('/dist', express.static('public/dist'))

app.get('/new', (req, res) => {
    const token = generateToken()

    tokens[token] = true

    res.send(token)
})

function generateToken() {
    return Math.random().toString(36).substr(2, 10).toUpperCase()
}

app.get('/test', (req, res) => {
    res.sendFile('test.html', { root: __dirname + '/public/' })
})

app.get('/send/:token', (req, res) => {
    const token = req.params.token
    if (tokens[token]) {
        res.sendFile('send.html', { root: __dirname + '/public/' })
    } else {
        res.send('Invalid token: ' + token)
    }
})

app.get('/:token', (req, res) => {
    const token = req.params.token
    if (tokens[token]) {
        res.sendFile('index.html', { root: __dirname + '/public/' })
    } else {
        res.send('Invalid token: ' + token)
    }
})

io.on('connection', socket => {
    socket.on('room', room => {
        console.log('got a listener in room %s', room)
        socket.join(room)
    })
})

io.of('/send').on('connection', socket => {
    socket.on('message', data => {
        console.log('got message %s for room %s', data.data, data.room)
        io.sockets.in(data.room).emit('message', data.data)
    })
})

server.listen(8080, _ => console.log('App listening on port 8080!'))
