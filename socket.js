const SocketIO = require('socket.io');
// const ios = require('express-socket.io-session');
const User = require('./schemas/user')
const Room = require('./schemas/room');
const familyMember = require('./schemas/familyMember');

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

    const addNewUser = (userId, socketId) => {
        !onlineUsers.some((user) => user.userId === userId) &&
            onlineUsers.push({ userId, socketId });
        // console.log(11, socketId)
        // console.log(22, onlineUsers)
    };

    const removeUser = (socketId) => {
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
    };

    const getUser = (userId) => {
        return onlineUsers.find((user) => user.userId === userId);
    };

    // io.use(async (SocketIO, next) => {
    //     const userInfo = SocketIO.handshake.auth.user;
    //     console.log("use =>", userInfo);

    //     const session = await Room.findOne({ userId: userInfo.userId })
    //     console.log("session =>", session);
    //     const { userId } = userInfo;
    // })

    //* 웹소켓 연결 시
    room.on("connection", (socket) => {
        // const req = socket.request;
        // const {
        //     headers: { referer },
        // } = req;
        // console.log(999, referer)
        // const roomId = referer.split('/')[referer.split('/').length - 1].replace(/\?.+/, '');


        socket.on("newUser", userId => {
            addNewUser(userId, socket.id)
            console.log(111, userId, socket.id)
        });

        socket.on("newRoom", (async (roomName, userId) => {
            const findRoom = await Room.find({ userId: userId })
            const findRoomId = findRoom.roomId
            socket.join(findRoomId)
            console.log("socket.rooms =>", socket.rooms)
        }));

        socket.on("join", (async (userId) => {

            const findRoom = await Room.find({ userId: userId })
            console.log(222, findRoom[0][0])
            console.log(333, findRoom[0][0].userId)
            const findRoomId = findRoom.roomId
            socket.join(findRoomId)
            console.log("socket.rooms =>", socket.rooms)
        }));
        // Users.find().all([{ name: 'zerocho' }, { age: 24 }]);

        socket.on("sendNotification", ({ senderName, receiverName, type, category }) => {
            const receiver = getUser(receiverName);
            // const date = new Date();
            io.to(receiver.socketId).emit("getNotification", {
                senderName,
                type,
                category,

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

