const productionCenter = require('../models/productionCenter.models');
const productionCenterProducts = require('../models/productionCenterProductModels')
const artical = require('../models/articalModels');

exports.createProdutionCenter = async (req, res) => {
    try {
        let { name, printerCode } = req.body;

        let checkProduction = await productionCenter.findOne({ name: name })

        if (checkProduction) {
            return res.status(401).json({ status: 401, message: "Production Center Alredy Added...." })
        }

        checkProduction = await productionCenter.create({
            name,
            printerCode
        });

        return res.status(201).json({ status: 201, message: "Production Center Created SuccessFully....", productionCenter: checkProduction })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};

exports.getAllProductionCenter = async (req, res) => {
    try {
        let page = parseInt(req.query.page);
        let pageSize = parseInt(req.query.pageSize);

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedProductionCenter;

        paginatedProductionCenter = await productionCenter.find();

        let count = paginatedProductionCenter.length;

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "Production Center Not Found" })
        }

        if (page && pageSize) {
            startIndex = (page - 1) * pageSize;
            lastIndex = (startIndex + pageSize);
            paginatedProductionCenter = paginatedProductionCenter.slice(startIndex, lastIndex);
        }

        return res.status(200).json({ status: 200, totalProductionCenter: count, message: "All Production Center Found SuccessFully....", productionCenter: paginatedProductionCenter })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
}

exports.getProductionCenter = async (req, res) => {
    try {
        let id = req.params.id;

        let getProductionCenter = await productionCenter.findById(id);

        if (!getProductionCenter) {
            return res.status(404).json({ status: 404, message: "ProductionCenter  Not Found" })
        }

        return res.status(200).json({ status: 200, message: "ProductionCenter Found SuccessFully...", productionCenter: getProductionCenter })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
}

exports.updateProdutionCenter = async (req, res) => {
    try {
        let id = req.params.id;

        let updateProdutionCenter = await productionCenter.findById(id);

        if (!updateProdutionCenter) {
            return res.status(404).json({ status: 404, message: "ProductionCenter Data Not Found " })
        }

        updateProdutionCenter = await productionCenter.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.status(200).json({ status: 200, message: "ProductionCenter Data Updated SuccessFully....", productionCenter: updateProdutionCenter })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};

exports.deleteProductionCenter = async (req, res) => {
    try {
        let id = req.params.id;

        let deleteProductionCenter = await productionCenter.findById(id);

        if (!deleteProductionCenter) {
            return res.status(404).json({ status: 404, message: "ProductionCenter Not Found" })
        }

        await productionCenter.findByIdAndDelete(id);

        return res.status(200).json({ status: 200, message: "Production Center Deleted SuccessFully...." })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
}


exports.addProductionCenterProduct = async (req, res) => {
    try {
        let { productionCenterId, articalId } = req.body;

        let checkProduct = await productionCenterProducts.findOne({ productionCenterId, articalId });

        if (checkProduct) {
            return res.status(401).json({ status: 401, message: "Artical already exists" })
        }

        checkProduct = await productionCenterProducts.create({
            productionCenterId,
            articalId
        });

        return res.status(201).json({ status: 201, message: "Artical Added SuccessFully...", productionCenterArticals: checkProduct });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
};

exports.getAllProductionCenterProduct = async (req, res) => {
    try {
        let page = parseInt(req.query.page);
        let pageSize = parseInt(req.query.pageSize);

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And Page Size Cann't Be Less Than 1" })
        }

        let paginatedProductionCenterProducts;

        paginatedProductionCenterProducts = await productionCenterProducts.find();

        let count = paginatedProductionCenterProducts.length;

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "Production Center Products Not Found" })
        }

        if (page && pageSize) {
            startIndex = (page - 1) * pageSize
            lastIndex = (startIndex + pageSize)
            paginatedProductionCenterProducts = paginatedProductionCenterProducts.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalDigitalMenu: count, message: "All Production Center Products Found SuccessFully...", ProductionCenterProducts: paginatedProductionCenterProducts });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};

exports.deleteProductionCenterProduct = async (req, res) => {
    try {
        let id = req.params.id;

        let { articalId } = req.body;

        let chckDigitalMenu = await productionCenterProducts.findOne({ productionCenterId: id })

        if (!chckDigitalMenu) {
            return res.status(404).json({ status: 404, message: "Production Center Products Not Found" });
        }

        let checkarticalId = await productionCenterProducts.findOne({ productionCenterId: id, articalId: articalId })

        if (!checkarticalId) {
            return res.status(404).json({ status: 404, message: "Artical Not Found" });
        }

        await productionCenterProducts.findOneAndDelete(articalId)

        return res.status(200).json({ status: 200, message: "Product Removed SuccessFully..." });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
}

exports.getProducts = async (req, res) => {
    try {

        let { ids } = req.body

        let checkArticalId = await artical.find({ productionCenterId: { $in: ids } })

        if (!checkArticalId) {
            return res.status(404).json({ status: 404, message: "Artical Not Found" })
        }

        return res.status(200).json({ status: 200, message: "Artical data Found SuccessFully...", artical: checkArticalId })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}