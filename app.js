const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const rooms = {}

app.use('/node_modules', express.static('node_modules'))
app.use('/dist', express.static('public/dist'))

app.get('/new', (req, res) => {
    const room = generateRoom()

    rooms[room] = true

    res.send(room)
})

function generateRoom() {
    return Math.random().toString(36).substr(2, 10).toUpperCase()
}

app.get('/send/:room', (req, res) => {
    const room = req.params.room
    if (rooms[room]) {
        res.sendFile('send.html', { root: __dirname + '/public/' })
    } else {
        res.send('Invalid room: ' + room)
    }
})

app.get('/:room', (req, res) => {
    const room = req.params.room
    if (rooms[room]) {
        res.sendFile('index.html', { root: __dirname + '/public/' })
    } else {
        res.send('Invalid room: ' + room)
    }
})

io.on('connection', socket => {
    socket.on('room', room => {
        if (rooms[room]) {
            socket.join(room)
        } else {
            socket.disconnect(true)
        }
    })
})

io.of('/send').on('connection', socket => {
    socket.on('message', data => {
        io.in(data.room).emit('message', data.data)
    })
})

server.listen(8080, _ => console.log('App listening on port 8080!'))
