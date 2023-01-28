const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const admins = ['krutman', 'merikovichkrutoi']
const passwords = ['111', '222']
let online = 0

server.listen(3000)

app.get('/', (req, res)=> {
    res.sendFile(__dirname + '/index.html')
})

app.get('/adminList', (req, res) => {
    const correct = admins.indexOf(req.query.nickname)

    if (correct !== -1) {
        res.json(`${admins[correct]}/${passwords[correct]}`)
    } else {
        res.json(false)
    }
})

app.get('/online', (req, res) => {
    console.log('okay')
    res.json(online)
})

io.on('connection', (socket) => {
    socket.on('new message', (data) => {
        io.emit('new message', {
            name: data.name,
            message: data.message,
            isAdmin: data.isAdmin
        })
    })
})

io.sockets.on('connection', (socket) => {
    online = +online + 1 

    socket.on('disconnect', () => {
        online = +online - 1
    })
})