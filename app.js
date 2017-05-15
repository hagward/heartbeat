const express = require('express')
const app = express()
const server = require('http').createServer(app)
const WebSocket = require('ws')
const wss = new WebSocket.Server({ server: server })

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

wss.on('connection', ws => {
    const url = ws.upgradeReq.url

    if (url.startsWith('/sender')) {
        const token = url.substring(8)

        console.log('sender connected with token: %s', token)

        ws.on('message', message => {
            const client = clients[token]
            if (client) {
                client.send(message, error => console.log(error))
            }
        })
    } else if (url.startsWith('/receiver')) {
        const token = url.substring(10)

        console.log('receiver connected with token: %s', token)

        if (tokens[token]) {
            clients[token] = ws
        }
    }
})

server.listen(8080, _ => console.log('App listening on port 8080!'))
