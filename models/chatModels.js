const mongoose = require('mongoose');

const ChatSchema = mongoose.Schema({
    senderId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require: true
    },
    receiverid: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require: true
    },
    groupId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userGroupJoin',
        require:true
    },
    message:{
        type:String,
        require:true
    },
    readBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Chat', ChatSchema);