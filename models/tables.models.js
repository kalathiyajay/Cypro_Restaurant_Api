const mongoose = require('mongoose');

const tableSchema = mongoose.Schema({
    sectorName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sector',
        require: true
    },
    tableName: {
        type: Number,
        require: true
    },
    status: {
        type: String,
        enum: ['Available', 'Busy'],
        default:'Available',
        require: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Table', tableSchema);