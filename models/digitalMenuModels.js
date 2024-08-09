const mongoose = require('mongoose');

const digitalMenuSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    digitalMenuId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DigitalMenu',
        require: true
    },
    articalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artical',
        require: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('digitalMenu', digitalMenuSchema);