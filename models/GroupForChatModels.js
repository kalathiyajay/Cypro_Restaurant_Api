const mongoose = require('mongoose');

const GroupForChatSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    photo: {
        type: String,
        require: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('GroupForChat', GroupForChatSchema);