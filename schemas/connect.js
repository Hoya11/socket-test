const mongoose = require("mongoose");

const connetSchema = mongoose.Schema({
    userId: {
        type: String
    },
    connected: {
        type: Boolean,
        default: false,
    },
    connectedAt: {
        type: String
    }
})

connetSchema.virtual('connetId').get(function () {
    return this._id.toHexString();
});

connetSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model("Connet", connetSchema)
