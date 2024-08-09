const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose
            .connect(process.env.MONGODB_PATH)
            .then(() => console.log('DB Is Connected...'))
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

module.exports = connectDB;