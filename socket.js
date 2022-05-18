const SocketIO = require('socket.io');
// const ios = require('express-socket.io-session');
const User = require('./schemas/user')
const Room = require('./schemas/room');
const user = require('./schemas/user');

module.exports = (server) => {
    // 서버 연결, path는 프론트와 일치시켜준다.

    const io = SocketIO(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });
    console.log("socket 연결");
    io.use(async (socket, next) => {
        const userInfo = socket.handshake.auth.user;
        console.log("use부분", userInfo); // tnwjd
        // 어딘가의 저장소에서 찾고있음
        const session = await User.findOne({ _Id: userInfo.userId });
        console.log("세션", session);
        const { userId, nickname, profileImg } = userInfo;

        // 비 회원 없음
        if (!userInfo) {
            return next(new Error("에러!!!!!!!"));
        }

        //기존 사람 데이터가 있음
        if (session) {
            socket.userId = userId;
            socket.nickname = nickname;
            socket.id = userId;
            socket.profileImg = profileImg; // tnwjd
            await User.updateOne({ userId }, { $set: { connected: true } });
            return next();
        }

        socket.userId = userId;
        socket.nickname = nickname;
        socket.id = userId;
        socket.profileImg = profileImg; // tnwjd

        await Room.create({ userId, nickname, profileImg, connected: true });
        next();
    });
    // let onlineUsers = [];

    // const room = io.of('/room')
    // const chat = io.of('/chat')

    // const addNewUser = (username, socketId) => {
    //     !onlineUsers.some((user) => user.username === username) &&
    //         onlineUsers.push({ username, socketId });
    //     // console.log(11, socketId)
    //     console.log(22, onlineUsers)
    // };

    // const removeUser = (socketId) => {
    //     onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
    // };

    // const getUser = (username) => {
    //     return onlineUsers.find((user) => user.username === username);
    // };
    //* 웹소켓 연결 시
    io.on("connection", (socket) => {
        socket.on("newUser", (username) => {
            addNewUser(username, socket.id);
        });

        socket.on("join", async (roomName, targetUser) => {
            console.log("roomName =", roomName);
            socket.join(roomName);
            console.log(socket.id, socket.nickname);
            console.log("tergetUser = ", targetUser);

            const TargetUser = await Room.findOne({ userId: targetUser }, _Id, nickname, profileImg)

            const nowUser = {
                userId: socket.userId,
                nickname: socket.nickname,
                profileImage: socket.profileImage,
            };

            const receive = {
                roomName,
                // CreateUser,
                targetUser: nowUser,
            };

            const saveData = {
                ...receive,
                targetUser2: TargetUser,
            };
            console.log("receive: ", receive);
            // 여기서 이미 존재하는 방인지 검사해서 없을때만 아래구문 실행해야함
            // const existRoom = await Room.findOne({ _id: roomId });
            // const existRooms = await chatData.findOne({ enteringRoom: roomName });
            // console.log("existRooms", existRooms);
            // // console.log("existRoom", existRoom);
            // if (!existRoom) {
            //     await Chat.create(saveData); // 유저정보 둘다 있는 데이터
            //     socket.to(TargetUser.userId).emit("join_room", receive);
            // }
            // if (!existRooms) {
            //     await chatData.updateOne(
            //         { userId },
            //         { $push: { enteringRoom: roomName } }
            //     );
            //     await chatData.updateOne(
            //         { userId: TargetUser.userId },
            //         { $push: { enteringRoom: roomName } }
            //     );
            // }
        })

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