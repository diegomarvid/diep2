const express = require('express');

const app = express();

let serv = require('http').Server(app);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});

app.use('/client', express.static(__dirname + '/client'));

serv.listen(process.env.PORT || 8080, function() {
    console.log("Server listening at 8080");
});

//JS

let e = require('./js/Entity');
let d = require('./js/declarations');


SOCKET_LIST = {};

let io = require('socket.io')(serv, {});

io.sockets.on('connection', function(socket) {
    console.log('socket connection');

    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;

    socket.on('logIn', function(data) {
        e.Player.onConnect(socket, data.username);
        socket.emit('logInResponse', {success: true});
    });
    

    socket.on('disconnect', function() {
        delete SOCKET_LIST[socket.id];
        e.Player.onDisconnect(socket);
    });


});

setInterval(function() {

    let packs = e.Entity.getFrameUpdateData();

    let socket;

    for(let i in SOCKET_LIST) {
        socket = SOCKET_LIST[i];

        socket.emit('init', packs.initPack);
        socket.emit('update', packs.updatePack);
        socket.emit('remove', packs.removePack);

    }

}, 18)
