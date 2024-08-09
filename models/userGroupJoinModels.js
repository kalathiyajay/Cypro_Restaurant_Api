const mongoose = require('mongoose');

const userGroupJoinSchema = mongoose.Schema({
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GroupForChat',
        require: true
    },
    userId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    }]
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('userGroupJoin', userGroupJoinSchema);