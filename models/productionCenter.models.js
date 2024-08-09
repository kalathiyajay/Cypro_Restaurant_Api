const mongoose = require('mongoose');

const productionCenterSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    printerCode: {
        type: Number,
        require: true,
        unique: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('ProductionCenter', productionCenterSchema);