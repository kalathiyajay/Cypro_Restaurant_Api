const digitalMenu = require('../models/digitalMenuModels');
const digitalMenuProduct = require('../models/digitalMenuProduct.Models')

exports.createDigitalMenu = async (req, res) => {
    try {
        let { name } = req.body;

        let chekcName = await digitalMenu.findOne({ name: name })

        if (chekcName) {
            return res.status(401).json({ status: 401, message: "Digital Menu already exists" })
        }

        chekcName = await digitalMenu.create({
            name
        });

        return res.status(201).json({ status: 201, message: "Digital Menu Created successfully", digitalMenu: chekcName });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};


exports.getAllDigitalMenu = async (req, res) => {
    try {
        let page = parseInt(req.query.page);
        let pageSize = parseInt(req.query.pageSize);

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And Page Size Cann't Be Less Than 1" })
        }

        let paginatedDigitalMenu;

        paginatedDigitalMenu = await digitalMenu.find();

        let count = paginatedDigitalMenu.length;

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "Digital Menu Not Found" })
        }

        if (page && pageSize) {
            startIndex = (page - 1) * pageSize
            lastIndex = (startIndex + pageSize)
            paginatedDigitalMenu = paginatedDigitalMenu.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalDigitalMenu: count, message: "All Digital Menu Found SuccessFully...", digitalMenu: paginatedDigitalMenu });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};

exports.getDigitalMenu = async (req, res) => {
    try {
        let id = req.params.id;

        let getMenu = await digitalMenu.findById(id);

        if (!getMenu) {
            return res.status(404).json({ status: 404, message: "Digital Menu Not Found" })
        }

        return res.status(200).json({ status: 200, message: "Digital Menu Found SuccessFully...", digitalMenu: getMenu });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};

exports.updateDigitalMenu = async (req, res) => {
    try {
        let id = req.params.id;

        let changMenu = await digitalMenu.findById(id);

        if (!changMenu) {
            return res.status(404).json({ status: 404, message: "Digital Menu Not Found" });
        }

        changMenu = await digitalMenu.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.status(200).json({ status: 200, message: "Digital Menu Updated SuccessFully...", digitalMenu: changMenu })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};

exports.deleteDigitalMenu = async (req, res) => {
    try {
        let id = req.params.id;

        let removeMenu = await digitalMenu.findById(id);

        if (!removeMenu) {
            return res.status(404).json({ status: 404, message: "Digital Menu Not Found" })
        }

        await digitalMenu.findByIdAndDelete(id);

        return res.status(200).json({ status: 200, message: "Digital Menu Deleted SuccessFully..." })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};


exports.addProduct = async (req, res) => {
    try {
        let { digitalMenuId, articalId } = req.body;

        let checkProduct = await digitalMenuProduct.findOne({ digitalMenuId, articalId });

        if (checkProduct) {
            return res.status(401).json({ status: 401, message: "Artical already exists" })
        }

        checkProduct = await digitalMenuProduct.create({
            digitalMenuId,
            articalId
        });

        return res.status(201).json({ status: 201, message: "Artical Added SuccessFully...", digitalMenuArtical: checkProduct });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
};

exports.getAllDigitalMenuProduct = async (req, res) => {
    try {
        let page = parseInt(req.query.page);
        let pageSize = parseInt(req.query.pageSize);

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And Page Size Cann't Be Less Than 1" })
        }

        let paginateddigitalMenuProduct;

        paginateddigitalMenuProduct = await digitalMenuProduct.find();

        let count = paginateddigitalMenuProduct.length;

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "Digital Menu Product Not Found" })
        }

        if (page && pageSize) {
            startIndex = (page - 1) * pageSize
            lastIndex = (startIndex + pageSize)
            paginateddigitalMenuProduct = paginateddigitalMenuProduct.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalDigitalMenu: count, message: "All Digital Menu Product Found SuccessFully...", digitalMenuProducts: paginateddigitalMenuProduct });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        let id = req.params.id;

        let { articalId } = req.body;

        let chckDigitalMenu = await digitalMenuProduct.findOne({ digitalMenuId: id })

        if (!chckDigitalMenu) {
            return res.status(404).json({ status: 404, message: "Digital Menu Not Found" });
        }

        let checkArticalId = await digitalMenuProduct.findOne({ articalId: articalId })

        if (!checkArticalId) {
            return res.status(404).json({ status: 404, message: "Artical Not Found" });
        }

        await digitalMenuProduct.findOneAndDelete(articalId)

        return res.status(200).json({ status: 200, message: "Product Removed SuccessFully..." });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
}

exports.getMenu = async (req, res) => {
    try {
        let { id } = req.body

        let checkDigitalMenu = await digitalMenu.find({ _id: { $in: id } })

        if (!checkDigitalMenu) {
            return res.status(404).json({ status: 404, message: 'Digital Menu Not Found' })
        }

        const items = await digitalMenuProduct.find({ digitalMenuId: { $in: id } });

        if (!items.length) {
            return res.status(404).json({ status: 404, message: 'Product Not Found' });
        }

        return res.status(200).json({ status: 200, message: "Digital Menu Data Found SuccessFully...", digitalMenu: items });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}