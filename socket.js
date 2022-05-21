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
        console.log("소켓 연결됨", socket.id)
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
            const findUserId = userId.userId
            // console.log("familyList =>", familyList)
            const familyList = await FamilyMember.find({ userId: findUserId })
            const familyId = familyList[0].familyId

            socket.join(familyId)
            // console.log("socket.rooms =>", socket.rooms)
        })


        socket.on("leaveRoom", async (nowFamilyId) => {
            console.log("leaveRoom =>", nowFamilyId)
            await socket.leave(nowFamilyId)
            console.log("leaveRoom.rooms =>", socket.rooms)
            //가족리스트 클릭이동 시 
            try {
                socket.on("movingRoom", async (familyId) => {
                    console.log("familyId =>", familyId)
                    const findFamilyId = familyId.familyId
                    socket.join(findFamilyId)
                    console.log("socket.rooms =>", socket.rooms)
                })
            } catch (error) {
                console.log(error)
            }
        })


        // Users.find().all([{ name: 'zerocho' }, { age: 24 }]);

        //가족 멤버 초대
        socket.on("inviteMember", async ({ familyId, familyMemberNickname, selectEmail, nickname }) => {
            // console.log("5555", familyId, familyMemberNickname, selectEmail)
            const findUser = await User.findOne({ email: selectEmail })
            // console.log("findUser", findUser)

            const receiver = getUser(findUser.userId)

            //createdAt을 한국 시간대로 설정
            const cur_date = new Date()
            const utc = cur_date.getTime() + (cur_date.getTimezoneOffset() * 60 * 1000)
            const time_diff = 9 * 60 * 60 * 1000
            const createdAt = new Date(utc + time_diff)

            // console.log("receiver", receiver)

            //alert DB
            //alert를 DB에 생성하는 API
            await Alert.create({
                familyId,
                userId: findUser.userId,
                familyMemberNickname,
                selectEmail,
                category: "가족 초대",
                type: "초대",
                nickname,
                createdAt,
            })
        })

        socket.on("getMyAlert", async ({ userId, type }) => {

            if (userId == userId) {
                // console.log("get 알림(userId) =>", userId)
                // console.log("get 알림(type) =>", type)
                const receiver = getUser(userId)
                // console.log("receiver    ", receiver)
                const findUserAlertDB = await Alert.find({ userId, type })
                // console.log("findUserAlertDB   ", findUserAlertDB)

                io.to(receiver.socketId).emit("newInviteDB", {
                    findUserAlertDB: findUserAlertDB,
                })
            }
        })




        //초대 수락버튼 클릭 시
        socket.on("inviteJoin", async ({ userId, familyId, familyMemberNickname }) => {
            // console.log("familyId =>", familyId, userId, familyMemberNickname)
            const findRoom = await Room.findOne({ familyId: familyId })
            // console.log("findRoom =>", findRoom)

            if (findRoom) {
                await Room.updateOne({ familyId: familyId }, { $push: { familyMemberList: { userId: userId, userNickname: familyMemberNickname } } })
            }

            // console.log("222", findRoom)
            socket.join(familyId)
            // console.log("socket.rooms =>", socket.rooms)
        })

        // 사진 좋아요 알림
        socket.on("sendNotification", (async ({ userName, userId, type, category }) => {
            console.log("sendNotification-userId =>", userId)
            // const receiver = getUser(userId)

            const cur_date = new Date()
            const utc = cur_date.getTime() + (cur_date.getTimezoneOffset() * 60 * 1000)
            const time_diff = 9 * 60 * 60 * 1000
            const createdAt = new Date(utc + time_diff)

            await Alert.create({
                userName,
                userId,
                type,
                category,
                createdAt
            })
        }))



        // 사진 추가 알림
        socket.on("sendFamilyNoti", (async ({ userId, senderName, receiverFamily, category, type }) => {
            // console.log("socket.rooms =>", socket.rooms)
            socket.join(receiverFamily)
            // console.log("무슨값오지?", userId, senderName, receiverFamily, category, type)
            //createdAt을 한국 시간대로 설정
            const cur_date = new Date()
            const utc = cur_date.getTime() + (cur_date.getTimezoneOffset() * 60 * 1000)
            const time_diff = 9 * 60 * 60 * 1000
            const createdAt = new Date(utc + time_diff)

            //alert를 DB에 생성하는 API
            await Alert.create({
                userId,
                familyId: receiverFamily,
                category,
                type,
                nickname: senderName,
                createdAt,
            })
        }))

        // socket.on("userConnect", async ({ userId }) => {
        //     console.log("userConnect-userId =>", userId)
        //     const receiver = getUser(userId)
        //     const findUserConnect = await 
        // })

        // 알림
        socket.on("getFamilyNoti", async ({ userId }) => {
            console.log("getFamilyNoti rooms =>", socket.rooms)
            console.log("getFamilyNoti 알림(userId) =>", userId)
            // console.log("getFamilyNoti 알림(familyId) =>", familyId)

            const receiver = getUser(userId)

            const findRoom = await Room.find({ familyMemberList: { $all: { userId: userId } } })
            // console.log(findRoom)

            console.log("getFamilyNoti receiver => ", receiver)
            const findUserAlertDB = await Alert.find({ userId })
            console.log("findUserAlertDB   ", findUserAlertDB)

            io.to(receiver.socketId).emit("notiReturn", {
                findAlertDB: findUserAlertDB,
            })
        })




        socket.on("disconnect", () => {
            removeUser(socket.id)
            console.log("소켓 연결끊어졌음", socket.id)
        })
    })
}


