const mongoose = require("mongoose");

const connectSchema = mongoose.Schema({
    userId: {
        type: String
    },
    connected: {
        type: Boolean,
    },
    connectedAt: {
        type: String
    }
})

connectSchema.virtual('connectId').get(function () {
    return this._id.toHexString();
});

connectSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model("Connect", connectSchema)
