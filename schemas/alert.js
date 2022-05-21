const mongoose = require("mongoose")

const alertSchema = mongoose.Schema({
    familyId: {
        type: String,
    },
    userId: {
        type: String,
        required: true,
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
})

alertSchema.virtual("alertId").get(function () {
    return this._id.toHexString()
})

alertSchema.set("toJSON", {
    virtuals: true,
})

module.exports = mongoose.model("Alert", alertSchema)
