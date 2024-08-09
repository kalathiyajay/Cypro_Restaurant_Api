const mongoose = require('mongoose')

const walletLogSchema = mongoose.Schema({
    transcationId: {
        type: String,
        require: true
    },
    walletId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wallet',
        require: true
    },
    creditAmount: {
        type: Number,
        require: true
    },
    transcationType: {
        type: String,
        require: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('WalletLog', walletLogSchema);