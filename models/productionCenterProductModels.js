const mongoose = require('mongoose');

const productionCenterProductSchema = mongoose.Schema({
    productionCenterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductionCenter',
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

module.exports = mongoose.model('ProductionCenterProducts', productionCenterProductSchema);