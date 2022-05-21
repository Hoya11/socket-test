const SocketIO = require("socket.io")
// const ios = require('express-socket.io-session');
const User = require("./schemas/user")
const Room = require("./schemas/room")
const FamilyMember = require("./schemas/familyMember")
const Alert = require("./schemas/alert")

module.exports = server => {
    // 서버 연결, path는 프론트와 일치시켜준다.

    const io = SocketIO(server, {
        // path: "/socket.io",
        cors: {
            origin: "*",
            // methods: ["GET", "POST"]
        },
    })
    // app.set('io', io)

    // 네임스페이스 등록
    const room = io.of("/room")

    let onlineUsers = []

    const addNewUser = (userId, socketId) => {
        !onlineUsers.some(user => user.userId === userId) && onlineUsers.push({ userId, socketId })
        // console.log(11, socketId)
        // console.log(22, onlineUsers)
    }

    const removeUser = socketId => {
        onlineUsers = onlineUsers.filter(user => user.socketId !== socketId)
    }

    const getUser = userId => {
        return onlineUsers.find(user => user.userId === userId)
    }

    // io.use(async (SocketIO, next) => {
    //     const userInfo = SocketIO.handshake.auth.user;
    //     console.log("use =>", userInfo);

    //     const session = await Room.findOne({ userId: userInfo.userId })
    //     console.log("session =>", session);
    //     const { userId } = userInfo;
    // })

    //* 웹소켓 연결 시
    io.on("connection", socket => {
        // const req = socket.request;
        // const {
        //     headers: { referer },
        // } = req;
        // console.log(999, referer)
        // const roomId = referer.split('/')[referer.split('/').length - 1].replace(/\?.+/, '');

        socket.on("newUser", userId => {
            addNewUser(userId, socket.id)
            // console.log(111, userId, socket.id)
        })

        //회원가입 후 처음 가족 생성할 때
        socket.on("newRoom", async (roomName, userId) => {
            // console.log("userId", userId)
            const findRoom = await Room.find({ hostId: userId })
            // console.log("findRoom", findRoom)
            const roomFamilyId = findRoom.familyId
            // console.log("roomFamilyId", roomFamilyId)
            socket.join(roomFamilyId)
            // console.log("socket.rooms =>", socket.rooms)
        })

        //로그인 버튼 클릭 시
        socket.on("join", async (userId) => {
            // console.log("userId =>", userId)
            const familyList = await FamilyMember.find({ userId: userId })
            // console.log("familyList =>", familyList)

            const familyId = familyList[0].familyId
            // console.log("familyId =>", familyId)

            // const findRoom = await Room.findOne({ familyId })
            // console.log(22, findRoom)

            // const roomId = findRoom.roomId

            // const findRoomId = roomId
            socket.join(familyId)
            console.log("socket.rooms =>", socket.rooms)
        })

        // Users.find().all([{ name: 'zerocho' }, { age: 24 }]);

        //가족 멤버 초대
        socket.on("inviteMember", async ({ familyId, familyMemberNickname, selectEmail, nickname }) => {
            console.log("5555", familyId, familyMemberNickname, selectEmail)
            const findUser = await User.findOne({ email: selectEmail })
            console.log("findUser", findUser)

            const receiver = getUser(findUser.userId)

            //createdAt을 한국 시간대로 설정
            const cur_date = new Date()
            const utc = cur_date.getTime() + cur_date.getTimezoneOffset() * 60 * 1000
            const time_diff = 9 * 60 * 60 * 1000
            const createdAt = new Date(utc + time_diff)

            console.log("receiver", receiver)

            //alert DB
            //alert를 DB에 생성하는 API
            const newInviteDB = await Alert.create({
                familyId,
                userId: findUser.userId,
                familyMemberNickname,
                selectEmail,
                category: "가족 초대",
                type: "초대",
                nickname,
                createdAt,
            })

            // invite 알림 이후에 바로 알림 DB에 생성 및 저장하며 실시간 알림에 보여주기.
            io.to(receiver.socketId).emit("newInviteDB", {
                newInviteDB: [newInviteDB],
            })
        })

        //초대 수락버튼 클릭 시
        socket.on("inviteJoin", async ({ userId, familyId, familyMemberNickname }) => {
            console.log("familyId =>", familyId, userId, familyMemberNickname)
            const findRoom = await Room.findOne({ familyId: familyId })
            console.log("findRoom =>", findRoom)

            if (findRoom) {
                await Room.updateOne({ familyId: familyId }, { $push: { familyMemberList: { userId: userId, userNickname: familyMemberNickname } } })
            }

            console.log("222", findRoom)
            socket.join(familyId)
            console.log("socket.rooms =>", socket.rooms)
        })


        socket.on("sendNotification", ({ senderName, receiverName, type, category }) => {
            const receiver = getUser(receiverName)
            console.log("getUser", getUser)
            console.log("receiver", receiver)
            // const date = new Date();
            io.to(receiver.socketId).emit("getNotification", {
                senderName,
                type,
                category,
            })
            // console.log(33, senderName, type, category)
            // console.log(44, receiver)
        })


        socket.on("sendFamilyNoti", (async ({ senderName, receiverFamily, category, type }) => {
            socket.join(receiverFamily)
            console.log("무슨값오지?", senderName, receiverFamily, category, type)
            console.log("socket.rooms =>", socket.rooms)
            //createdAt을 한국 시간대로 설정
            const cur_date = new Date()
            const utc = cur_date.getTime() + cur_date.getTimezoneOffset() * 60 * 1000
            const time_diff = 9 * 60 * 60 * 1000
            const createdAt = new Date(utc + time_diff)




            //alert DB
            //alert를 DB에 생성하는 API
            const getFamilyNotiDB = await Alert.create({
                familyId: receiverFamily,
                nickname: senderName,
                category,
                type,
                createdAt,
            })

            console.log("socket.rooms =>", socket.rooms)
            // invite 알림 이후에 바로 알림 DB에 생성 및 저장하며 실시간 알림에 보여주기.
            socket.to(receiverFamily).emit("getFamilyNoti", {
                getFamilyNotiDB: [getFamilyNotiDB],
            })
        }))



        socket.on("sendText", ({ senderName, receiverName, text }) => {
            const receiver = getUser(receiverName)
            io.to(receiver.socketId).emit("getText", {
                senderName,
                text,
            })
        })

        socket.on("disconnect", () => {
            removeUser(socket.id)
        })
    })
}
