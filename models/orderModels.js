const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    tableId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Table',
        require: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    boxId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Box',
        require: true
    },
    deliveryCost: {
        type: Number,
        require: true
    },
    customerName: {
        type: String,
        require: true
    },
    person: {
        type: Number,
        require: true
    },
    reason: {
        type: String,
        require: true
    },
    orderType: {
        type: String,
        enum: ['local', 'delivery', 'withdraw'],
        require: true
    },
    paymentType: {
        type: String,
        enum: ['cash', 'debit', 'credit', 'transfer'],
        require: true
    },
    status: {
        type: String,
        enum: ['received', 'prepared', 'delivered', 'finalized', 'cancelled'],
        require: true
    },
    totalAmount: {
        type: Number
    },
    tip: {
        type: Number
    },
    discount: {
        type: Number,
        default: 0
    },
    orderDetails: [{
        ArticalId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Artical',
            require: true
        },
        quantity: {
            type: Number,
            require: true
        },
        notes: {
            type: String,
            require: true
        },
    }]
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Order', orderSchema);

