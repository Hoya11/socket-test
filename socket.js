const SocketIO = require("socket.io");

module.exports = (server) => {
    const io = SocketIO(server, { path: '/socket.io' });
    // SocketIO 객체의 두번째 인수로 옵션 객체를 넣어 서버에 관한 여러가지 설정 가능
    // 여기서는 클라이언트가 접속할 경로인 path 옵션만 사용 (클라이언트에서도 이 경로와 일치하는 path를 넣어야 함)

    io.on('connection', (socket) => { //웹 소켓 연결 시
        const req = socket.request;  // 요청 객체에 접근 (socket.request.res로는 응답 객체에 접근 가능)
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log('새로운 클라이언트 접속!', ip, socket.id, req.ip);
        // socket.id로 소켓 고유의 아이디를 가져올 수 있음 (이 아이디로 소켓의 주인이 누구인지 특정할 수 있음)

        socket.on('disconnect', () => { //연결 종료 시
            console.log('클라이언트 접속 해제', ip, socket.id);
            clearInterval(socket.interval);
        });

        socket.on('error', (error) => { //에러 발생 시
            console.log(error);
        });

        socket.on('reply', (data) => { // 클라이언트로부터 메세지 수신 시 (직접 만든 이벤트임)
            console.log(data);
        });

        socket.interval = setInterval(() => { //3초마다 클라이언트로 메세지 전송
            socket.emit('news', 'Hello Socket.IO'); // emit 인수는 두개임, 첫번째 인수는 이벤트 이름, 두번째는 데이터
        }, 3000);                                   // 즉 news라는 이벤트 이름으로 Hello Socket.IO라는 데이터를 클라이언트에 보낸 것
    })                                              // 클라이언트가 이 메세지를 받기 위해서는 news 이벤트 리스너를 만들어두어야 함
}