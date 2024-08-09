const subFamilies = require('../models/subFamiliesModels');
const artical = require('../models/articalModels');

exports.createSubFamilies = async (req, res) => {
    try {
        let { familieId, subFamiliesName } = req.body

        let chekcSubFamilies = await subFamilies.findOne({ subFamiliesName: subFamiliesName });

        if (chekcSubFamilies) {
            return res.status(401).json({ status: 401, message: "SubFamilieName Alredy added.." })
        }

        chekcSubFamilies = await subFamilies.create({
            familieId,
            subFamiliesName
        });

        return res.status(201).json({ status: 201, message: 'SubFamilies Created SuccessFully....', subFamilies: chekcSubFamilies })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};

exports.allSubFamilies = async (req, res) => {
    try {
        let page = parseInt(req.query.page);
        let pageSize = parseInt(req.query.pageSize);

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page PageSize Can't Be Less Than 1" });
        }

        let paginatedSubFamiles;

        paginatedSubFamiles = await subFamilies.find();

        let count = paginatedSubFamiles.length;

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "SubFamilies Not Found" })
        }

        if (page && pageSize) {
            startIndex = (page - 1) * pageSize;
            lastIndex = (startIndex + pageSize);
            paginatedSubFamiles = paginatedSubFamiles.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalSubFamilies: count, message: "All SubFamilies Found SuccessFully....", subFamilies: paginatedSubFamiles })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
};

exports.getSubFamilies = async (req, res) => {
    try {
        let id = req.params.id;

        let getSubFamilieById = await subFamilies.findById(id);

        if (!getSubFamilieById) {
            return res.status(404).json({ status: 404, message: "SubFamilies Not Found" })
        }

        return res.status(200).json({ status: 200, message: "SubFamilies Found SuccessFully....", subFamilies: getSubFamilieById });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
};

exports.updateSubFamilies = async (req, res) => {
    try {
        let id = req.params.id;

        let updateSubFamiles = await subFamilies.findById(id);

        if (!updateSubFamiles) {
            return res.status(404).json({ status: 404, message: "SubFamilies Not Found" });
        }

        updateSubFamiles = await subFamilies.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.status(200).json({ status: 200, message: "SubFamilies Updated SuccessFully....", subFamilies: updateSubFamiles });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
};

exports.deleteSubFamilies = async (req, res) => {
    try {
        let id = req.params.id;

        let deleteSubFamilies = await subFamilies.findById(id);

        if (!deleteSubFamilies) {
            return res.status(404).json({ status: 404, message: "SubFamilie Not Found" })
        }

        await subFamilies.findByIdAndDelete(id);

        return res.status(200).json({ status: 200, message: "SubFamilies Deleted SuccessFully...." });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
}


exports.getMultipleSubFamily = async (req, res) => {
    try {
        let chekSubFamilies = await subFamilies.find({ familieId: { $in: req.body.ids } })

        if (!chekSubFamilies) {
            return res.status(404).json({ status: 404, message: "SubFamilie Not Found" })
        }

        return res.status(200).json({ status: 200, message: "SubFamilies data Found SuccessFully...", subFamilies: chekSubFamilies })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getSubFamiliesWiseItem = async (req, res) => {
    try {
        let quary = {};

        if (req.body.familiesId) {
            quary.familiyId = { $in: req.body.familiesId }
        }

        if (req.body.subFamiliesId) {
            quary.subFamilyId = { $in: req.body.subFamiliesId }
        }

        let chekSubFamiliesData = await artical.find(quary)

        if (!chekSubFamiliesData.length) {
            return res.status(404).json({ status: 404, message: "Artical Not Found" });
        }

        return res.status(200).json({ status: 200, message: "Artical Data Found SuccessFylly..", articls: chekSubFamiliesData })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}