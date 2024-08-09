const mongoose = require('mongoose');

const boxSchema = mongoose.Schema({
    boxName: {
        type: String,
        require: true
    },
    cashierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    openingTime: {
        type: Date,
        require: true
    },
    startingAmount: {
        type: Number,
        require: true,
        default: 0
    },
    closingTime: {
        type: Date,
        require: true
    },
    finalAmount: {
        type: Number,
        require: true
    },
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'closed'
    },
    collectedAmount: {
        type: Number,
        require: true
    },
}, {
    timestamps: true,
    versionKey: false
});


module.exports = mongoose.model('Box', boxSchema);