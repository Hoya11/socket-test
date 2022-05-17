const SocketIO = require('socket.io');

module.exports = (server) => {
    // 서버 연결, path는 프론트와 일치시켜준다.

    const io = SocketIO(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    let onlineUsers = [];

    const addNewUser = (username, socketId) => {
        !onlineUsers.some((user) => user.username === username) &&
            onlineUsers.push({ username, socketId });
    };

    const removeUser = (socketId) => {
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
    };

    const getUser = (username) => {
        return onlineUsers.find((user) => user.username === username);
    };
    //* 웹소켓 연결 시
    io.on("connection", (socket) => {
        socket.on("newUser", (username) => {
            addNewUser(username, socket.id);
        });

        socket.on("sendNotification", ({ senderName, receiverName, type }) => {
            const receiver = getUser(receiverName);
            io.to(receiver.socketId).emit("getNotification", {
                senderName,
                type,
            });
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

