const families = require('../models/familiesModels');

exports.createFamilies = async (req, res) => {
    try {
        let { familiesName } = req.body;

        let checkFamilies = await families.findOne({ familiesName: familiesName })

        if (checkFamilies) {
            return res.status(401).json({ status: 401, message: "Familie Alredy Added" })
        }

        checkFamilies = await families.create({
            familiesName
        });

        return res.status(201).json({ status: 201, message: "Familie Created SuccessFully.....", families: checkFamilies });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
};

exports.getAllFamilies = async (req, res) => {
    try {
        let page = parseInt(req.query.page);
        let pageSize = parseInt(req.query.page);

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: " Page And Page Size Can't Be Less Than 1 " })
        }

        let paginatedFamilies;

        paginatedFamilies = await families.find();

        let count = paginatedFamilies.length;

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "Familie Not Found" })
        }

        if (page && pageSize) {
            startIndex = (page - 1) * pageSize
            lastIndex = (startIndex + pageSize)
            paginatedFamilies = paginatedFamilies.slice(startIndex, lastIndex);
        }

        return res.status(200).json({ status: 200, totalFamilies: count, message: "All Families Data Found SuccessFully...", families: paginatedFamilies });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
};

exports.getFamilies = async (req, res) => {
    try {
        let id = req.params.id;

        let getFamilesId = await families.findById(id);

        if (!getFamilesId) {
            return res.status(404).json({ status: 404, message: "Famile Not Found" })
        }

        return res.status(200).json({ status: 200, message: "Familie Data Found", families: getFamilesId })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.updateFamilies = async (req, res) => {
    try {
        let id = req.params.id;

        let updateFamiliesById = await families.findById(id);

        if (!updateFamiliesById) {
            return res.status(404).json({ status: 404, message: "Familie Not Found" })
        }

        updateFamiliesById = await families.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.status(200).json({ status: 200, message: "Familie Data Updated SuccessFully.....", families: updateFamiliesById });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.deleteFamilies = async (req, res) => {
    try {
        let id = req.params.id;

        let deleteFamilies = await families.findById(id);

        if (!deleteFamilies) {
            return res.status(404).json({ status: 404, message: "Famile Not Found" })
        }

        await families.findByIdAndDelete(id);

        return res.status(200).json({ status: 200, message: "Familie Data Deleted SuccessFully...." });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}
