const mongoose = require("mongoose")

const alertSchema = mongoose.Schema({
    senderName: {
        type: String,
    }, //좋아요 누르거나 댓글 작성한 사람의 닉네임
    receiverName: {
        type: String,
    }, //좋아요 및 댓글이 추가된 게시물의 userId
    category: {
        type: String,
    }, //좋아요 및 댓글이 추가된 게시물의 카테고리
    type: {
        type: String,
        required: true,
    }, //알림의 type. "좋아요" 와 "댓글"
    date: {
        type: Date,
        default: Date.now,
    }, // 좋아요 및 댓글이 추가된 날짜 및 시간
})

module.exports = mongoose.model("Alert", alertSchema)
//alertId는 socketId로 대신한다.