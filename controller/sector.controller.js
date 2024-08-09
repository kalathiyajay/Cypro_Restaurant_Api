const sector = require('../models/sector.models');
const Table = require('../models/tables.models');
const order = require('../models/orderModels');
const user = require('../models/user.models');
const article = require('../models/articalModels');

exports.createSector = async (req, res) => {
    try {
        let { name, numberOfTables } = req.body;

        let checkSector = await sector.findOne({ name: name });

        if (checkSector) {
            return res.status(401).json({ status: 401, message: "Sector Is Alredy Added..." })
        }

        checkSector = await sector.create({
            name,
            numberOfTables
        });

        let tables = [];
        for (let i = 1; i <= numberOfTables; i++) {
            tables.push({ tableName: i, sectorName: checkSector._id });
        }

        await Table.insertMany(tables);

        return res.status(201).json({ status: 201, message: "Sector Added Successfully...", sector: checkSector });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};


exports.getAllSector = async (req, res) => {
    try {

        let page = parseInt(req.query.page);
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "page And pageSize Cann't Be Less Then 1" });
        }

        let paginatedSector;

        paginatedSector = await sector.find();

        let count = paginatedSector.length;

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "Sector Not Found" })
        }

        if (page && pageSize) {
            startIndex = (page - 1) * pageSize;
            lastIndex = (startIndex + pageSize);
            paginatedSector = paginatedSector.slice(startIndex, lastIndex);
        }

        return res.status(200).json({ status: 200, TotalSector: count, message: 'All Sector Found Successfully..', sector: paginatedSector });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
}

exports.getSectorById = async (req, res) => {
    try {
        let id = req.params.id;

        let sectorById = await sector.findById(id);

        if (!sectorById) {
            return res.status(404).json({ status: 404, message: "Sector Not Found" })
        }

        return res.status(200).json({ status: 200, message: "Get Sector Data Successfully...", sector: sectorById });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
}

exports.updateSector = async (req, res) => {
    try {
        let id = req.params.id;

        let { numberOfTables } = req.body;

        let checkSectorId = await sector.findById(id);

        if (!checkSectorId) {
            return res.status(404).json({ status: 404, message: "Sector Not Found" })
        }

        let currentNumberOfTables = checkSectorId.numberOfTables;
        let tableDifference = numberOfTables - currentNumberOfTables;

        if (tableDifference < 0) {
            let tablesToRemove = await Table.find({ sectorName: id }).sort({ tableName: -1 }).limit(Math.abs(tableDifference));
            let tableIdsToRemove = tablesToRemove.map(table => table._id);

            await Table.deleteMany({ _id: { $in: tableIdsToRemove } });
        }

        else if (tableDifference > 0) {
            let tablesToAdd = [];
            for (let i = currentNumberOfTables + 1; i <= numberOfTables; i++) {
                tablesToAdd.push({ tableName: i, sectorName: id });
            }

            await Table.insertMany(tablesToAdd);
        }

        checkSectorId = await sector.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.status(200).json({ status: 200, message: "Sector Updated Successfully..", sector: checkSectorId })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
}

exports.deleteSector = async (req, res) => {
    try {
        let id = req.params.id;

        let checkSectorId = await sector.findById(id);

        if (!checkSectorId) {
            return res.status(404).json({ status: 404, message: "Sector Not Found" });
        }

        await Table.deleteMany({ sectorName: { $in: id } })
        await sector.findByIdAndDelete(id);

        return res.status(200).json({ status: 200, message: "Sector Removed Successfully.." });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
}

exports.addtable = async (req, res) => {
    try {
        let id = req.params.id;

        let { numberOfTable } = req.body

        let checkSector = await sector.findById(id)

        if (!checkSector) {
            return res.status(404).json({ status: 404, message: "Secotr Not Found" })
        }

        let chekTable = await Table.find({ sectorName: id }).sort({ tableName: -1 })
        let tableName = chekTable[0].tableName
        let tables = [];

        for (let i = tableName + 1; i <= tableName + numberOfTable; i++) {
            tables.push({ tableName: i, sectorName: checkSector._id });
        }

        await Table.insertMany(tables);

        checkSector.numberOfTables += numberOfTable;

        await checkSector.save();

        return res.status(201).json({ status: 201, message: "Table Added SuccessFully..", table: checkSector })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
}

exports.getTableStats = async (req, res) => {
    try {
        let id = req.params.id;
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

        if (start === undefined || end === undefined) {
            return res.status(400).json({ status: 400, message: "Invalid month provided" });
        }

        let orders = await order.find({
            tableId: id,
            createdAt: { $gte: start, $lt: end }
        });

        if (orders.length === 0) {
            return res.status(404).json({ status: 404, message: "Orders Not Found" });
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

        return res.status(200).json({ status: 200, message: "Table Order Found SuccessFully...", tableState: responseData });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
}

exports.getSectorWithTable = async (req, res) => {
    try {
        let { ids } = req.body;

        let checkSector = await Table.find({ sectorName: { $in: ids } })

        if (!checkSector.length) {
            return res.status(404).json({ status: 404, message: "Table Not Found" })
        }

        return res.status(200).json({ status: 200, message: "Table Found SuccessFully...", sectorWithTable: checkSector });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}