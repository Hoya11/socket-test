const mongoose = require("mongoose")

const roomSchema = mongoose.Schema({
    familyId: {
        type: String,
        required: true
    },
    hostId: {
        type: String,
    },
    connected: {
        type: Boolean,
        default: false,
    },
    familyMemberList: {
        type: Array
    }
})
roomSchema.virtual('roomId').get(function () {
    return this._id.toHexString();
});

roomSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model("Room", roomSchema)
