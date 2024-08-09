const mongoose = require('mongoose');

const digitalMenuProductSchema = mongoose.Schema({
    digitalMenuId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'digitalMenu',
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

module.exports = mongoose.model('digitalMenuProducts', digitalMenuProductSchema);