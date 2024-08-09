const user = require('../models/user.models');
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer');
const order = require('../models/orderModels');
const Box = require('../models/boxModels')

exports.createNewUser = async (req, res) => {
    try {
        let { name, email, password, confirmPassword, role } = req.body;

        let chekUser = await user.findOne({ email: req.body.email })

        if (chekUser) {
            return res.status(401).json({ status: 401, message: "User Is already Exists" });
        }

        if (password !== confirmPassword) {
            return res.status(401).json({ status: 401, message: "Password And ConfirmPassword Not Match" })
        }

        let salt = await bcrypt.genSalt(10);
        let hashPassword = await bcrypt.hash(req.body.password, salt);

        chekUser = await user.create({
            name,
            email,
            password: hashPassword,
            role
        });

        return res.status(201).json({ status: 201, message: "User Created Successfully...", user: chekUser });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        let page = parseInt(req.query.page);
        let pageSize = parseInt(req.query.pageSize);

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "page And pageSize Cann't Be Less Then 1" })
        }

        let paginatedUser;

        paginatedUser = await user.find();

        let count = paginatedUser.length;

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "User Not Found" })
        }

        if (page && pageSize) {
            startIndex = (page - 1) * pageSize;
            lastIndex = (startIndex + pageSize);
            paginatedUser = paginatedUser.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalUsers: count, message: "All Users Found SuccessFully...", users: paginatedUser });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        let id = req.params.id

        let userFindById = await user.findById(id);

        if (!userFindById) {
            return res.status(404).json({ status: 404, message: "User Not Found" })
        }

        return res.status(200).json({ status: 200, message: "User Found SuccessFully...", user: userFindById });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        let id = req.params.id

        let userUpdateById = await user.findById(id);

        if (!userUpdateById) {
            return res.status(404).json({ status: 404, message: "User Not Found" });
        }

        userUpdateById = await user.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.status(200).json({ status: 200, message: "User Updated SuccessFully...", user: userUpdateById });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};

exports.removeUser = async (req, res) => {
    try {
        let id = req.params.id

        let removeUser = await user.findById(id);

        if (!removeUser) {
            return res.status(404).json({ status: 404, message: "User Not Found" });
        }

        await user.findByIdAndDelete(id);

        return res.status(200).json({ status: 200, message: "User Deleted SuccessFully..." });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};

exports.generateUserReport = async (req, res) => {
    try {
        let startDate = req.query.startDate
        let lastDate = req.query.lastDate

        let months = {
            January: 1,
            Fabruary: 2,
            March: 3,
            April: 4,
            May: 5,
            June: 6,
            July: 7,
            Augast: 8,
            Suptember: 9,
            Octomber: 10,
            November: 11,
            December: 12
        }

        let currentYear = new Date().getFullYear()

        let start = new Date(currentYear, months[startDate] - 1, 1)
        let end = new Date(currentYear, months[lastDate])

        let getUser = await user.find({ createdAt: { $gte: start, $lt: end } })

        let count = getUser.length

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "User Not Found" })
        }

        return res.status(200).json({ status: 200, totalUsers: count, message: "User Found SuccessFully...", users: getUser })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}


exports.getUserOrderById = async (req, res) => {
    try {
        let id = req.params.id

        let startDate = req.query.startDate;
        let endDate = req.query.endDate;

        let months = {
            January: 1,
            Fabruary: 2,
            March: 3,
            April: 4,
            May: 5,
            June: 6,
            July: 7,
            Augast: 8,
            Suptember: 9,
            Octomber: 10,
            November: 11,
            December: 12
        }

        const currentYear = new Date().getFullYear();

        const start = new Date(currentYear, months[startDate] - 1, 1);
        const end = new Date(currentYear, months[endDate]);

        let orders = await order.find({
            userId: id,
            createdAt: { $gte: start, $lt: end }
        })

        if (!orders) {
            return res.status(404).json({ status: 404, message: "Order Not Found" });
        }

        let responseData = [];

        for (let order of orders) {
            const customer = await user.findById(order.userId);
            if (customer) {
                order.customerName = customer.name;
            }

            if (!order.totalAmount) {
                let total = 0;
                for (const detail of order.orderDetails) {
                    const articleData = await article.findById(detail.ArticalId);
                    if (!articleData) {
                        return res.status(404).json({ status: 404, message: "Artical Not Found" })
                    }
                    total += article.salePrice * detail.quantity;
                }
                order.totalAmount = total;
            }

            responseData.push(order);
        }

        return res.status(200).json({ status: 200, message: "User Order Found SuccessFully...", userOrders: responseData });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
}

exports.sentInvitaionLinkToAdmin = async (req, res) => {
    try {
        const { name, email } = req.body;

        let chekUser = await user.findOne({ email: email })

        if (chekUser) {
            return res.status(401).json({ status: 401, message: "User Alrdey Added.." })
        }

        chekUser = await user.create({
            name,
            email,
            role: "Admin"
        })

        const token = Date.now().toString();
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);

        chekUser.resetPasswordToken = token;

        chekUser.resetPasswordExpires = expiryDate;

        await chekUser.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: chekUser.email,
            subject: 'Registration Confirmation',
            text: `Hello ${name},\n\n` +
                `Congratulations! Your registration for the Restaurant Website is confirmed\n\n` +
                `Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n` +
                `http://localhost:4000/api/set-password/${token}\n\n` +
                `If you did not request this, please ignore this email and your password will not changed.\n\n` +
                `Thank You`
        };

        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ status: 500, message: error.message });
            }
            return res.status(200).json({ status: 200, message: 'Email Sent Successfully...' });
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};


exports.sentInvitationLinkToWaiter = async (req, res) => {
    try {
        let { name, email } = req.body;

        let chekUser = await user.findOne({ email: email })

        if (chekUser) {
            return res.status(401).json({ status: 401, message: "User Alrdey Added.." })
        }

        chekUser = await user.create({
            name,
            email,
            role: 'Waiter'
        });

        const token = Date.now().toString();
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);

        chekUser.resetPasswordToken = token;

        chekUser.resetPasswordExpires = expiryDate;

        await chekUser.save();

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });

        const mailOptions = {
            form: process.env.EMAIL_USER,
            to: chekUser.email,
            subject: "Registration Confirmation",
            text: `Hello ${name},\n\n` +
                `Congratulations! Your registration for the Restaurant Website is confirmed\n\n` +
                `Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n` +
                `http://localhost:4000/api/set-password/${token}\n\n` +
                `If you did not request this, please ignore this email and your password will not set.\n\n` +
                `Thank You`
        };

        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ status: 500, message: error.message })
            }
            return res.status(200).json({ status: 200, message: "Email Sent SuccessFully..." })
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({})
    }
}

exports.dashBoard = async (req, res) => {
    try {

        const orders = await order.find()
        const orderIds = orders.map(order => order._id);

        const orderDetails = await order.find({ _id: { $in: orderIds } }).populate('orderDetails.ArticalId');

        let sale = 0;
        let cost = 0;

        orderDetails.forEach(order => {
            order.orderDetails.forEach(detail => {
                sale += detail.quantity * detail.ArticalId.salePrice;
                cost += detail.quantity * detail.ArticalId.costPrice;
            });
        });

        const paymentMethods = {
            cash: orders.filter(order => order.paymentType === 'cash').length,
            debit: orders.filter(order => order.paymentType === 'debit').length,
            credit: orders.filter(order => order.paymentType === 'credit').length,
            transfer: orders.filter(order => order.paymentType === 'transfer').length
        };

        const statusSummary = {
            received: orders.filter(order => order.status === 'received').length,
            prepared: orders.filter(order => order.status === 'prepared').length,
            delivered: orders.filter(order => order.status === 'delivered').length,
            finalized: orders.filter(order => order.status === 'finalized').length
        };

        const popularProducts = {};
        for (const order of orderDetails) {
            for (const detail of order.orderDetails) {
                const artical = detail.ArticalId;
                if (!popularProducts[artical._id]) {
                    popularProducts[artical._id] = {
                        name: artical.name,
                        image: artical.image,
                        orderCount: 0
                    };
                }
                popularProducts[artical._id].orderCount += detail.quantity;
            }
        }
        const popularProductsList = Object.values(popularProducts).sort((a, b) => b.order_count - a.order_count);

        const boxEntries = await Box.find();

        const boxEntriesList = boxEntries.map(box => ({
            boxName: box.boxName,
            collectedAmount: box.collectedAmount
        }));

        const cancelledOrders = orders.filter(order => order.status === 'cancelled');

        const responseData = {
            statisticalData: {
                totalOrders: orders.length,
                totalIncome: sale - cost,
                deliverOrders: orders.filter(order => order.orderType === 'delivery').length
            },
            paymentMethods: paymentMethods,
            totalRevenue: sale,
            statusSummary: statusSummary,
            popularProducts: popularProductsList,
            boxEntry: boxEntriesList,
            cancelledOrders: cancelledOrders
        };

        return res.status(200).json({ status: 200, message: "DashBoard Data Found SuccessFully...", dashBoard: responseData });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};
