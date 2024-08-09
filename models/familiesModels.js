const mongoose = require('mongoose');

const familiesSchema = mongoose.Schema({
    familiesName: {
        type: String,
        required: true
    }
},
    {
        timestamps: true,
        versionKey: false
    }
);


module.exports = mongoose.model('families', familiesSchema);