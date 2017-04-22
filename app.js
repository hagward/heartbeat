'use strict'

const express = require('express')
const app = express()
const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 8080 })

app.get('/send/:clientId', (req, res) => {
    res.sendFile('send.html', { root: __dirname + '/public/' })
})

app.get(/.+/, (req, res) => {
    res.sendFile('index.html', { root: __dirname + '/public/' })
})

let connectionId = 0
const clients = {}

wss.on('connection', ws => {
    const url = ws.upgradeReq.url

    if (url.startsWith('/sender')) {
        const clientId = url.substring(8)

        console.log('sender connected with id "%s"', clientId)

        ws.on('message', message => {
            const client = clients[clientId]
            if (client) {
                console.log('sending message: "%s"', message)
                client.send(message)
            }
        })
    } else if (url.startsWith('/receiver')) {
        const clientId = url.substring(10)

        console.log('receiver connected with id "%s"', clientId)

        if (clientId) {
            clients[clientId] = ws
        }
    }
})

app.listen(12345, _ => console.log('App listening on port 12345!'))