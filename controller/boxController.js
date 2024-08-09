const box = require('../models/boxModels');

exports.createBox = async (req, res) => {
    try {
        let { boxName, cashierId } = req.body;

        let checkBox = await box.findOne({ boxName: boxName })

        if (checkBox) {
            return res.status(401).json({ status: 401, message: "Box Name Alredy Added.." })
        }

        checkBox = await box.create({
            boxName,
            cashierId
        });

        return res.status(201).json({ status: 201, message: "Box Created SuccessFully...", box: checkBox });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
};

exports.getAllBox = async (req, res) => {
    try {
        let page = parseInt(req.query.page);
        let pageSize = parseInt(req.query.pageSize);

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Cann't Be Less than 1" })
        }

        let paginatedBox;

        paginatedBox = await box.find();

        let count = paginatedBox.length;

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "Box Not Found" })
        }

        if (page && pageSize) {
            startIndex = (page - 1) * pageSize;
            lastIndex = (startIndex + pageSize);
            paginatedBox = paginatedBox.slice(startIndex, lastIndex);
        }

        return res.status(200).json({ status: 200, totalBox: count, message: "All Box Found SuccessFully...", boxs: paginatedBox });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
};

exports.getBoxById = async (req, res) => {
    try {
        let id = req.params.id;

        let getBoxId = await box.findById(id);

        if (!getBoxId) {
            return res.status(404).json({ status: 404, message: "Box Not Found" });
        }

        return res.status(200).json({ status: 200, message: "Box Found SuccessFully...", box: getBoxId });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.updateBoxData = async (req, res) => {
    try {
        let id = req.params.id;

        let checkBoxId = await box.findById(id);

        if (!checkBoxId) {
            return res.status(404).json({ status: 404, message: "Box Not Found" })
        }

        checkBoxId = await box.findByIdAndUpdate(id, { ...req.body }, { new: true })

        return res.status(200).json({ status: 200, message: "Box Data Updated SuccessFully...", box: checkBoxId });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.openBoxUpdate = async (req, res) => {
    try {
        let id = req.params.id;

        let { startingAmount } = req.body;

        let checkBox = await box.findById(id);

        if (!checkBox) {
            return res.status(404).json({ status: 404, message: "Box Not Found" });
        }

        if (checkBox.status === 'open') {
            return res.status(401).json({ status: 401, message: 'Box is already open' });
        }

        if (checkBox.openingTime) {
            return res.status(401).json({ status: 401, message: 'Box has already been opened' });
        }

        checkBox.openingTime = new Date();
        checkBox.startingAmount = startingAmount;
        checkBox.status = 'open';

        await checkBox.save();

        return res.status(200).json({ status: 200, message: "Starting Amount Set SuccessFully...", box: checkBox });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
};

exports.closeBoxUpdate = async (req, res) => {
    try {
        let id = req.params.id;

        let { finalAmount } = req.body;

        let chekcBox = await box.findById(id);

        if (!chekcBox) {
            return res.status(404).json({ status: 404, message: "Box Not Found" })
        }

        if (chekcBox.status === 'closed') {
            return res.status(401).json({ status: 401, message: "Box Is Already Closed..." })
        }

        chekcBox.closingTime = new Date();
        chekcBox.finalAmount = finalAmount;
        chekcBox.status = 'closed';

        let collectedAmount = finalAmount - chekcBox.startingAmount

        chekcBox.collectedAmount = collectedAmount

        await chekcBox.save();

        return res.status(200).json({ status: 200, message: "Box Closed SuccessFully...", box: chekcBox });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.deleteBox = async (req, res) => {
    try {
        let id = req.params.id;

        let checkBox = await box.findById(id)

        if (!checkBox) {
            return res.status(404).json({ status: 404, message: "Box Not Found" });
        }

        await box.findByIdAndDelete(id);

        return res.status(200).json({ status: 200, message: "Box Deleted SuccessFully..." });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
}

exports.genreteBoxReport = async (req, res) => {
    try {
        let startDate = req.query.startDate
        let endDate = req.query.endDate

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

        let getReport = await box.find({ createdAt: { $gte: start, $lt: end } });

        let count = getReport.length

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "No Boxes Found" })
        }

        return res.status(200).json({ Status: 200, totalBox: count, message: "Box Report Found SuccessFully..", box: getReport });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
}