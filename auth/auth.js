const user = require('../models/user.models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

exports.userLogin = async (req, res) => {
    try {
        let { email, password } = req.body;

        let checkEmail = await user.findOne({ email: email, status: 'Active' })

        if (!checkEmail) {
            return res.status(404).json({ status: 404, message: "Email Not Found" })
        }

        let passwordComapre = await bcrypt.compare(password, checkEmail.password);

        if (!passwordComapre) {
            return res.status(404).json({ status: 404, message: "Password Not Match" })
        }

        let token = await jwt.sign({ _id: checkEmail._id }, process.env.SECRET_KEY, { expiresIn: "1H" })

        return res.status(200).json({ status: 200, message: "User Login SuccessFully...", user: checkEmail, token: token })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
};

exports.setPassword = async (req, res) => {
    try {
        const { token } = req.params;

        const { newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).json({ status: 400, message: 'Password is required' });
        }

        const chekUser = await user.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

        if (!chekUser) {
            return res.status(404).json({ status: 404, message: 'Password Reset Token Is Invalid or has expired' });
        }

        let salt = await bcrypt.genSalt(10);
        let hashPassword = await bcrypt.hash(newPassword, salt);

        chekUser.password = hashPassword;

        chekUser.resetPasswordToken = undefined;

        chekUser.resetPasswordExpires = undefined;

        await chekUser.save();

        return res.status(200).json({ status: 200, message: 'Password Created Successfully...' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
} 