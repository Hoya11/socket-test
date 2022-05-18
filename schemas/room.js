const mongoose = require("mongoose")

const roomSchema = mongoose.Schema({
    roomId: {
        type: String,
        required: true,
    },
    familyId: {
        type: String,
        required: true
    }
})
randomMsgSchema.virtual('roomId').get(function () {
    return this._id.toHexString();
});

randomMsgSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model("Room", roomSchema)
