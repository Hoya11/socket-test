const { string } = require("joi")
const mongoose = require("mongoose")

const alertSchema = mongoose.Schema({
    familyId: {
        type: String,
    },
    userId: {
        type: String,
    },
    familyMemberNickname: {
        type: String,
    },
    selectEmail: {
        type: String,
    },
    category: {
        type: String,
    },
    type: {
        type: String,
    },
    nickname: {
        type: String,
    },
    createdAt: {
        type: Date,
    },
    receiverId: {
        type: String,
    },
    senderName: {
        type: String,
    }
})

alertSchema.virtual("alertId").get(function () {
    return this._id.toHexString()
})

alertSchema.set("toJSON", {
    virtuals: true,
})

module.exports = mongoose.model("Alert", alertSchema)
