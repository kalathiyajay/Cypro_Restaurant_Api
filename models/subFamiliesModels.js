const mongoose = require('mongoose');

const subFamiliesSchema = mongoose.Schema({
    familieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'families',
        require: true
    },
    subFamiliesName: {
        type: String,
        require: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('SubFamilies', subFamiliesSchema)