const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
        unique: true
    },
    confirmPassword: {
        type: String,
        require: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['ATM', 'Waiter', 'Kitchen', 'Cashier', 'Admin', 'User'],
        require: true
    },
    status: {
        type: String,
        enum: ['Active', 'Suspend'],
        default: "Active"
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('User', userSchema);