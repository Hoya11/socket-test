const mongoose = require("mongoose")

const roomSchema = mongoose.Schema({

    familyId: {
        type: String,
        required: true
    }
})
// roomSchema.virtual('roomId').get(function () {
//     return this._id.toHexString();
// });

// roomSchema.set('toJSON', {
//     virtuals: true,
// });

module.exports = mongoose.model("Room", roomSchema)
