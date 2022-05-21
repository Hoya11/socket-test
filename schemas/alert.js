const mongoose = require("mongoose")

const alertSchema = mongoose.Schema({
    familyId: {
        type: String,
    },
    userId: {
        type: String,
    },
    familyId: {
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
        required: true,
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
