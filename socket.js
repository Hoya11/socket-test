const SocketIO = require('socket.io');
const ios = require('express-socket.io-session');
const User = require('./schemas/user')

module.exports = (server, app, sessionMiddleware) => {
    // 서버 연결, path는 프론트와 일치시켜준다.

    const io = SocketIO(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    // app.set("io", io)

    const room = io.of("/rooms")
    room.use(ios(sessionMiddleware, { autoSave: true }))
    const chat = io.of("/chat")
    chat.use(ios(sessionMiddleware, { autoSave: true }))

    const test = io.of("/userin")
    test.use(ios(sessionMiddleware, { autoSave: true }))
    test.on("connection", socket => {
        console.log("클라이언트 연결")
        //const redis = redisClient

        console.log(socket.handshake.session)

        socket.emit("message", "서버에서 메세지")

        socket.on("join", massage => {
            console.log(massage)
            // socket.emit("message",socket.handshake.session.passport.user+"접속확인"+massage);
            console.log(socket.handshake.session)

            //socket 에서의 핸드쉐이킹 과정 끝난 후, session으로 들어가서
            //가져오는 user 정보가 인증이 됐는 지를 확인하는 역할
            //인증 절차가 무사히 끝난 user만 추가(저장) 및 조회해서 가져오겠다는 것.
            if (socket.handshake.session.passport) {
                userId = socket.handshake.session.passport.user
                //앞서서 인증된 user

                // redis.hset("users", userid, socket.id)
                // 위 코드의 역할 = userid.socket.id 로 저장한 것.
                //데이터 저장
                // userid 라는 키 값에 socket.id 라는 필드를 저장한 것.
                //HSET: 입력한 해시 키 밑에 지정한 필드에 값을 저장하고 필드 값이 존재하면 덮어쓴다.
                //문법: HSET key field value
                //예시: HSET myhashkey1 field1 "Hello"
                //우리 본문의 addNewUser 역할

                //위의 redis.hset 과 같은 역할의 함수
                let onlineUserList = []

                const addUser = (userId, socketId) => {
                    !onlineUserList.some(user => user.userId === userId) && onlineUserList.push({ userId, socketId })
                    // console.log(11, socketId)
                    console.log(22, onlineUserList)
                }

                const getAUser = userId => {
                    onlineUserList.find(user => user.userId === userId)

                    if (err) {
                        console.log("getAUser에서 오류!", err)
                        test.to("message").emit("연결 실패!")
                    }
                    console.log("getAUser의 오류 obj -->", obj)
                    notice
                        .find({ userId: userId })
                        .then(data => {
                            test.to(obj).emit("message", data)
                        })
                        .catch()
                }

                const delUser = socketId => {
                    onlineUserList = onlineUserList.filter(user => user.socketId !== socketId)
                }
                // redis.hget("users", userId, function (err, obj) {
                //   // HGET: 입력한 해시 키 밑에 지정한 필드 값을 가져온다. 없으면 nll값을 반환한다.
                //   //저장된 데이터 조회
                //   // 문법: HGET key field
                //   // 예시: HGET myhashkey1 field1
                //   //우리 본문의 getUser 역할
                //   if (err) {
                //     console.log(err)
                //     test.to("message").emit("연결실패!")
                //     //test() 메서드는 주어진 문자열이 정규 표현식을 만족하는지 판별하고,
                //     //그 여부를 true 또는 false로 반환
                //   }
                //   console.log(obj)
                //   notice
                //     .find({ where: { userId: userId } })
                //     .then(data => {
                //       test.to(obj).emit("message", data)
                //     })
                //     .catch
                //     // test.to(obj).emit("message", "DB연결에러 문의")
                //     ()
                //   // test.to(obj).emit("message",socket.handshake.session.passport.user+"접속확인"+ massage);
                // })
            } else {
                test.to(socket.id).emit("message", "로그인 안됨..!")
            }
            // test.to(socket.id).emit("message",socket.handshake.session.passport.user+"접속확인"+ massage);
        })

        socket.on("sendMessage", message => {
            console.log("메세지 받았음", socket.handshake.session)
            // setTimeout(() => {
            //   console.log("메세지 보냈어요.")
            //   socket.emit("message",socket.handshake.session.passport.user+"접속확인");
            // }, 2000);
        })

        socket.on("disconnect", () => {
            let onlineUserList = []
            const delUser = socketId => {
                onlineUserList = onlineUserList.filter(user => user.socketId !== socketId)
            }

            if (userId) {
                delUser("users", req)
            }
            console.log("연결종료")
        })
    })

    //룸 생성
    room.on("connection", socket => {
        console.log("room 네임스페이스에 접속")
        console.log(socket.handshake.session)
        if (socket.handshake.session.passport) {
            if (socket.handshake.session.passport.user) {
                const req = socket.handshake.session.passport.user

                let onlineUserList = []

                const addUser = (userId, socketId) => {
                    !onlineUserList.some(user => user.userId === userId) && onlineUserList.push({ userId, socketId })
                    // console.log(11, socketId)
                    console.log(22, onlineUserList)
                }
                const getAUser = userId => {
                    onlineUserList.find(user => user.userId === userId)

                    if (err) {
                        console.log("getAUser에서 오류!", err)
                        test.to("message").emit("연결 실패!")
                    }
                    console.log("getAUser의 오류 obj -->", obj)
                    notice
                        .find({ userId: userId })
                        .then(data => {
                            test.to(obj).emit("message", data)
                        })
                        .catch()
                }
                console.log("req-->", req)
                //const redis = redisClient

                //redis.hset("users", req, socket.id)
                //addNewUser

                addUser("users", req, socket.id)

                // redis.hget("users", req, function (err, obj) {
                //   //getUser
                //   if (err) console.log(err)
                //   console.log(obj)
                // })

                getAUser("users", req, function (err, obj) {
                    if (err) console.log(err)
                    console.log(obj)
                })
            }
        }
        socket.on("disconnect", () => {
            let onlineUserList = []
            const delUser = socketId => {
                onlineUserList = onlineUserList.filter(user => user.socketId !== socketId)
            }
            delUser("users", req)
            //removeUser
            console.log("room 네임스페이스 접속 해제")
        })
    })

    chat.on("connection", socket => {
        console.log("chat 네임스페이스에 접속")
        const req = socket.handshake
        // const req = socket.request;
        // console.log(req);
        const {
            headers: { referer },
        } = req
        console.log(referer)
        const roomId = referer.split("/")[referer.split("/").length - 1].replace(/\?.+/, "")
        socket.join(roomId)
        socket.to(roomId).emit("join", {
            user: "system",
            chat: `${req.session.color}님이 입장하셨습니다.`,
        })

        socket.on("disconnect", () => {
            console.log("chat 네임스페이스 접속 해제")
            socket.leave(roomId)
            const currentRoom = socket.adapter.rooms[roomId]
            const userCount = currentRoom ? currentRoom.length : 0
            if (userCount === 0) {
                // 유저가 0명이면 방 삭제
                axios
                    // 주소 수정 필요
                    .delete(`https://lebania.shop/test/room/${roomId}`, {
                        headers: {
                            Cookie: socket.handshake.headers.cookie,
                        },
                    })
                    .then(() => {
                        console.log("방 제거 요청 성공")
                    })
                    .catch(error => {
                        console.error(error)
                    })
            } else {
                socket.to(roomId).emit("exit", {
                    user: "system",
                    chat: `${req.session.color}님이 퇴장하셨습니다.`,
                    //session.color ??
                })
            }
        })
        socket.on("chat", data => {
            socket.to(data.room).emit(data)
        })
    })
}