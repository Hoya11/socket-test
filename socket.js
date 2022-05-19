const SocketIO = require('socket.io');
// const ios = require('express-socket.io-session');
const User = require('./schemas/user')
const Room = require('./schemas/room');

module.exports = (server) => {
    // 서버 연결, path는 프론트와 일치시켜준다.

    const io = SocketIO(server, {
        // path: "/socket.io",
        cors: {
            origin: "*",
            // methods: ["GET", "POST"]
        }
    });
    // app.set('io', io)

    // 네임스페이스 등록
    const room = io.of('/room')

    let onlineUsers = [];

    const addNewUser = (username, socketId) => {
        !onlineUsers.some((user) => user.username === username) &&
            onlineUsers.push({ username, socketId });
        // console.log(11, socketId)
        // console.log(22, onlineUsers)
    };

    const removeUser = (socketId) => {
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
    };

    const getUser = (username) => {
        return onlineUsers.find((user) => user.username === username);
    };

    //* 웹소켓 연결 시
    io.on("connection", (socket) => {
        socket.on("newRoom", (username, roomName, done) => {
            console.log("socket.id =>", socket.id)
            console.log("socket.rooms =>", socket.rooms)
            socket.join(roomName)
            console.log("socket.rooms =>", socket.rooms)
            addNewUser(username, socket.id);
        });

        socket.on("sendNotification", ({ senderName, receiverName, type, category }) => {
            const receiver = getUser(receiverName);
            io.to(receiver.socketId).emit("getNotification", {
                senderName,
                type,
                category
            });
            console.log(33, senderName, type, category)
            console.log(44, receiver)
        });


        socket.on("sendText", ({ senderName, receiverName, text }) => {
            const receiver = getUser(receiverName);
            io.to(receiver.socketId).emit("getText", {
                senderName,
                text,
            });
        });

        socket.on("disconnect", () => {
            removeUser(socket.id);
        });
    });
};

