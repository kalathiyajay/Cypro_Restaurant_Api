const artical = require('../models/articalModels');
const Order = require('../models/orderModels');

exports.createArtical = async (req, res) => {
    try {
        let { name, code, productionCenterId, costPrice, salePrice, familiyId, subFamilyId, description, productImage } = req.body;

        let checkArtical = await artical.findOne({ name: name })

        if (checkArtical) {
            return res.status(401).json({ status: 401, message: "Artical Alredy Added..." })
        }

        if (!req.file) {
            return res.status(401).json({ status: 401, message: "Please Upload Product Image" })
        }

        checkArtical = await artical.create({
            name,
            code,
            productionCenterId,
            costPrice,
            salePrice,
            familiyId,
            subFamilyId,
            description,
            productImage: req.file.path
        });

        return res.status(201).json({ status: 201, message: "Artical Created SuccessFully....", artical: checkArtical })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};

exports.getAllArticals = async (req, res) => {
    try {
        let page = parseInt(req.query.page);
        let pageSize = parseInt(req.query.pageSize);

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Cann't Be Less than 1" })
        }

        let paginatedArticals;

        paginatedArticals = await artical.find();

        let count = paginatedArticals.length;

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "Artical Not Found" })
        }

        if (page && pageSize) {
            startIndex = (page - 1) * pageSize;
            lastIndex = (startIndex + pageSize);
            paginatedArticals = paginatedArticals.slice(startIndex, lastIndex);
        }

        return res.status(200).json({ status: 200, totalArtical: count, message: "All Articals Found SuccessFully...", articals: paginatedArticals });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};

exports.getArticals = async (req, res) => {
    try {
        let id = req.params.id

        let getArticals = await artical.findById(id);

        if (!getArticals) {
            return res.status(404).json({ status: 404, message: "Artical Not Found" })
        }

        return res.status(200).json({ status: 200, message: "Artical Found SuccessFully....", artical: getArticals });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};

exports.updateArticals = async (req, res) => {
    try {
        let id = req.params.id;

        let changeArticalData = await artical.findById(id);

        if (!changeArticalData) {
            return res.status(404).json({ status: 404, message: "Artical Not Found" })
        }

        if (req.file) {
            req.body.productImage = req.file.path
        }

        changeArticalData = await artical.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.status(200).json({ status: 200, message: "Artical Updated SuccessFully...", artical: changeArticalData });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};

exports.deleteArticals = async (req, res) => {
    try {
        let id = req.params.id;

        let removeArtical = await artical.findById(id);

        if (!removeArtical) {
            return res.status(404).json({ status: 404, message: "Artical Not Found" });
        }

        await artical.findByIdAndDelete(id);

        return res.status(200).json({ status: 200, message: "Artical Delete SuccessFully..." });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
}

exports.saleReport = async (req, res) => {
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

        const item = await artical.findById(id);
        if (!item) {
            return res.status(404).json({ status: 404, message: "Artical Not Found" });
        }

        const orders = await Order.find({
            'orderDetails.ArticalId': id,
            createdAt: { $gte: start, $lt: end }
        })

        if (!orders) {
            return res.status(404).json({ status: 404, message: "Orders Not Found" });
        }

        let responseData = orders.map(order => {
            if (!order.totalAmount) {
                order.totalAmount = order.orderDetails.reduce((total, detail) =>
                    total + (detail.quantity * detail.amount), 0);
            }

            return {
                ...order.toObject(),
                customerName: order.userId ? order.userId.name : null
            };
        });

        return res.status(200).json({ status: 200, message: "Sale Report Found Successfully", saleReport: responseData });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}