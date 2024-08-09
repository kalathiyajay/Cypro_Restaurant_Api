const mongoose = require('mongoose');

const walletSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true
    },
    credit:{
        type:Number,
        require:true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Wallet', walletSchema);