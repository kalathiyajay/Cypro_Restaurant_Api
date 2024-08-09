const table = require('../models/tables.models');

exports.createTable = async (req, res) => {
    try {
        let { sectorName, tableName, status } = req.body;

        let checkTable = await table.findOne({ tableName: req.body.tableName });

        if (checkTable) {
            return res.status(401).json({ status: 401, message: "Table Is Alredy Added..." })
        }

        checkTable = await table.create({
            sectorName,
            tableName,
            status
        });

        return res.status(201).json({ status: 201, message: "Table Added Successfully...", table: checkTable });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};

exports.getAllTables = async (req, res) => {
    try {

        let page = parseInt(req.query.page);
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "page And pageSize Cann't Be Less Then 1" });
        }

        let paginatedTables;

        paginatedTables = await table.find();

        let count = paginatedTables.length;

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "Tables Not Found" })
        }

        if (page && pageSize) {
            startIndex = (page - 1) * pageSize;
            lastIndex = (startIndex + pageSize);
            paginatedTables = paginatedTables.slice(startIndex, lastIndex);
        }

        return res.status(200).json({ status: 200, TotalTables: count, message: 'All Tables Found Successfully..', tables: paginatedTables });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
}

exports.getTablesById = async (req, res) => {
    try {
        let id = req.params.id;

        let subTablesById = await table.findById(id);

        if (!subTablesById) {
            return res.status(404).json({ status: 404, message: "Tables Not Found" })
        }

        return res.status(200).json({ status: 200, message: "Get Tables Data Successfully...", table: subTablesById });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
}

exports.updateTables = async (req, res) => {
    try {
        let id = req.params.id;

        let checkTablesId = await table.findById(id);

        if (!checkTablesId) {
            return res.status(404).json({ status: 404, message: "Tables Not Found" })
        }

        checkTablesId = await table.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.status(200).json({ status: 200, message: "Tables Updated Successfully..", table: checkTablesId })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
}

exports.deleteTables = async (req, res) => {
    try {
        let id = req.params.id;

        let checkTablesId = await table.findById(id);

        if (!checkTablesId) {
            return res.status(404).json({ status: 404, message: "Tables Not Found" });
        }

        await table.findByIdAndDelete(id);

        return res.status(200).json({ status: 200, message: "Tables Removed Successfully.." });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
}
