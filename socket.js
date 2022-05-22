const SocketIO = require("socket.io")
// const ios = require('express-socket.io-session');
const User = require("./schemas/user")
const FamilyMember = require("./schemas/familyMember")
const Alert = require("./schemas/alert")
const Connect = require("./schemas/connect")


function timeForToday(createdAt) {
    const today = new Date()
    const timeValue = new Date(createdAt)

    const betweenTime = Math.floor(
        (today.getTime() - timeValue.getTime()) / 1000 / 60
    ) // 분
    if (betweenTime < 1) return '방금 전' // 1분 미만이면 방금 전
    if (betweenTime < 60) return `${betweenTime}분 전` // 60분 미만이면 n분 전

    const betweenTimeHour = Math.floor(betweenTime / 60) // 시
    if (betweenTimeHour < 24) return `${betweenTimeHour}시간 전` // 24시간 미만이면 n시간 전

    const betweenTimeDay = Math.floor(betweenTime / 60 / 24) // 일
    if (betweenTimeDay < 7) return `${betweenTimeDay}일 전` // 7일 미만이면 n일 전
    if (betweenTimeDay < 365)
        return `${timeValue.getMonth() + 1}월 ${timeValue.getDate()}일` // 365일 미만이면 년을 제외하고 월 일만

    return `${timeValue.getFullYear()}년 ${timeValue.getMonth() + 1
        }월 ${timeValue.getDate()}일` // 365일 이상이면 년 월 일
}



module.exports = server => {

    // 서버 연결, path는 프론트와 일치시켜준다.
    const io = SocketIO(server, {
        // path: "/socket.io",
        cors: {
            origin: "*",
            // methods: ["GET", "POST"]
        },
    })

    let onlineUsers = []
    const addNewUser = (userId, socketId) => {
        !onlineUsers.some(user => user.userId === userId) && onlineUsers.push({ userId, socketId })
    }

    const removeUser = socketId => {
        onlineUsers = onlineUsers.filter(user => user.socketId !== socketId)
    }

    const getUser = userId => {
        return onlineUsers.find(user => user.userId === userId)
    }

    //* 웹소켓 연결 시
    io.on("connection", socket => {
        console.log("소켓 연결됨", socket.id)

        socket.on("newUser", async ({ userId }) => {
            console.log("newUser-userId =>", userId)
            addNewUser(userId, socket.id)
            console.log("newUser-addNewUser =>", addNewUser)
            const receiver = getUser(userId)
            console.log("newUser-receiver =>", receiver)

            const createdAt = new Date()
            const userFind = await Connect.findOne({ userId })

            console.log("userFind =>", userFind)
            if (!userFind) {
                const newConnectedUser = await Connect.create({
                    userId: userId,
                    connected: true,
                    socketId: receiver.socketId,
                    connectedAt: createdAt
                })
                console.log("newConnectedUser", newConnectedUser)
            } else {
                if (userFind.connected === false) {
                    await Connect.updateOne({ userId }, { $set: { connected: true, socketId: receiver.socketId } })
                }
            }
        })




        //가족 멤버 초대
        socket.on("inviteMember", async ({ familyId, selectEmail, familyMemberNickname, nickname, type }) => {
            const findUser = await User.findOne({ email: selectEmail })
            const chkAlertDB = await Alert.findOne({ familyId, selectEmail, type })
            console.log("findUser =>", findUser)

            const userId = findUser._id
            const createdAt = new Date()

            if (!chkAlertDB) {
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
            } else {
                socket.emit('errorMsg', "이미 초대한 가족입니다.");
            }
            const receiver = getUser(userId)
            console.log("receiver", receiver)

            io.to(receiver.socketId).emit("newInviteDB", {
                findUserAlertDB: [{
                    familyId,
                    userId: findUser.userId,
                    familyMemberNickname,
                    selectEmail,
                    category: "가족 초대",
                    type: "초대",
                    nickname,
                    createdAt: timeForToday(createdAt),
                }]
            })
        })

        //가족 초대 수락
        socket.on("getMyAlert", async ({ userId, type }) => {
            if (userId && type) {
                const receiver = getUser(userId)
                const findUserAlertDB = await Alert.find({ userId, type: type })
                console.log("getMyAlert-receiver =>", receiver)
                console.log("getMyAlert-findUserAlertDB =>", findUserAlertDB)
                if (findUserAlertDB.length) {
                    for (let findUserDB of findUserAlertDB) {
                        findUserDB.createdAt = timeForToday(findUserDB.createdAt)
                    }
                    io.to(receiver.socketId).emit("newInviteDB", {
                        findUserAlertDB: findUserAlertDB,
                    })
                }
            }
        })

        // 사진 좋아요 알림
        socket.on("sendLikeNoti", (async ({ photoId, senderName, receiverId, type, category, likeChk }) => {
            const createdAt = new Date()

            if (likeChk) {
                await Alert.create({
                    photoId,
                    senderName,
                    receiverId,
                    type,
                    category,
                    createdAt
                })
            } else {
                await Alert.deleteOne({ photoId, receiverId })
            }

            const receiver = getUser(receiverId)
            io.to(receiver.socketId).emit("getNotification", {
                findAlertDB: {
                    photoId,
                    senderName,
                    receiverId,
                    type,
                    category,
                    createdAt: timeForToday(createdAt)
                }
            })
        }))

        // 사진 댓글 알림
        socket.on("sendCommentNoti", (async ({ photoId, senderName, receiverId, type, category }) => {
            console.log("sendNotification-userId =>", photoId, senderName, receiverId, type, category)
            const createdAt = new Date()

            await Alert.create({
                photoId,
                senderName,
                receiverId,
                type,
                category,
                createdAt
            })

            const receiver = getUser(receiverId)
            io.to(receiver.socketId).emit("getNotification", {
                findAlertDB: {
                    photoId,
                    senderName,
                    receiverId,
                    type,
                    category,
                    createdAt: timeForToday(createdAt)
                }
            })
        }))


        // 댓글 좋아요 알림보내는 부분
        socket.on("getPhotoAlert", async ({ receiverId }) => {
            const receiver = getUser(receiverId)
            const findUserAlertDB = await Alert.find({ receiverId })
            for (let alertDB of findUserAlertDB) {
                alertDB.createdAt = timeForToday(alertDB.createdAt)
            }
            io.to(receiver.socketId).emit("getNotification", {
                findAlertDB: findUserAlertDB,
            })
        })

        socket.on("imOut", (userId) => {
            console.log("imOut-userId", userId)
        })


        socket.on("disconnect", async () => {
            removeUser(socket.id)
            console.log("소켓 연결끊어졌음", socket.id)

            const userFind = await Connect.findOne({ socketId: socket.id })
            console.log("disconnect-userFind 11=>", userFind)
            const createdAt = new Date()

            if (userFind) {
                await Connect.updateOne({ socketId: socket.id }, { $set: { connected: false, connectedAt: timeForToday(createdAt) } })
            }
            console.log("disconnect-userFind 22=>", userFind)
        })
    })
}



// module.exports = { timeForToday }