const mongoose = require('mongoose');

const articalSchema = mongoose.Schema({
    name: {
        type: String,
        require: true 
    },
    code: {
        type: Number,
        require: true,
        unique: true
    },
    productionCenterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductionCenter',
        require: true
    },
    costPrice: {
        type: Number,
        require: true
    },
    salePrice: {
        type: Number,
        require: true
    },
    familiyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'families',
        require: true
    },
    subFamilyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubFamilies',
        require: true
    },
    description: {
        type: String,
        require: true
    },
    productImage: {
        type: String,
        require: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Artical', articalSchema);
