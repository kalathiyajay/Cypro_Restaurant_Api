const mongoose = require('mongoose');

const sectorSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    numberOfTables: {
        type: Number,
        require: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('sector', sectorSchema);