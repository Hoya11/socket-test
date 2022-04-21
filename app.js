const express = require("express")
const Http = require("http")
const socketIo = require("socket.io")


const app = express();
const http = Http.createServer(app);

const io = socketIo(http, {
    cors: {
        origin: "*",
        //여기에 명시된 서버만(호스트만) 내 서버에 허용한다
        //*(와일드카드) 모든문자열을 허용한다 라는 의미로 씀
        methods: ["GET", "POST"]
    },
})

app.get("/test", (req, res) => {
    res.send("익스프레스 서버가 잘켜졌음")
})

http.listen(5000, () => {
    console.log("서버가 켜졌습니다")
});


io.on("connection", (socket) => {
    console.log("연결됨")

    socket.send("연결 잘됬음")

    socket.emit("customEventName", "새로운 이벤트인가?")
})