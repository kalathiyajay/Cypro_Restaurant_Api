const order = require('../models/orderModels');
const Artical = require('../models/articalModels');

exports.createOrder = async (req, res) => {
    try {
        let { tableId, userId, boxId, deliveryCost, customerName, person, reason, orderType, paymentType, status, orderDetails, ArticalId, quantity, notes, tip, discount, totalAmount } = req.body;

        let checkOrder = await order.findOne({ customerName: customerName });

        if (checkOrder) {
            return res.status(401).json({ status: 401, message: "Order Is Alredy Added..." })
        }

        totalAmount = 0;
        for (let detail of orderDetails) {
            const article = await Artical.findById(detail.ArticalId);
            if (article) {
                totalAmount += article.salePrice * detail.quantity;
            } else {
                return res.status(400).json({ message: `Article with ID ${detail.ArticalId} not found` });
            }
        }

        totalAmount += deliveryCost;

        const discountAmount = totalAmount * (discount / 100);

        totalAmount -= discountAmount;

        checkOrder = await order.create({
            tableId,
            userId,
            boxId,
            deliveryCost,
            customerName,
            person,
            reason,
            orderType,
            paymentType,
            status,
            ArticalId,
            quantity,
            orderDetails,
            notes,
            discount,
            totalAmount
        });

        return res.status(201).json({ status: 201, message: "Order Is Created SuccessFully...", order: checkOrder });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        let page = parseInt(req.query.page);
        let pageSize = parseInt(req.query.pageSize);

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Cann't Be Less Than 1" });
        }

        let paginatedOrders;

        paginatedOrders = await order.find();

        let count = paginatedOrders.length;

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "Order Not Found" })
        }

        if (page && pageSize) {
            startIndex = (page - 1) * pageSize;
            lastIndex = (startIndex + pageSize);
            paginatedOrders = paginatedOrders.slice(startIndex, lastIndex);
        }

        return res.status(200).json({ status: 200, TotalOrders: count, message: "All Order Found SuccessFully...", orders: paginatedOrders });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getOrders = async (req, res) => {
    try {
        let id = req.params.id;

        let chekOrder = await order.findById(id);

        if (!chekOrder) {
            return res.status(404).json({ status: 404, message: "Order Not Found" })
        }

        return res.status(200).json({ status: 200, message: "Order Found SuccessFully...", order: chekOrder });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.updateOrderStatus = async (req, res) => {
    try {
        let id = req.params.id;

        let { status } = req.body;

        let updateOrder = await order.findById(id);

        if (!updateOrder) {
            return res.status(404).json({ status: 404, message: "Order Not Found" })
        }

        updateOrder.status = status;

        updateOrder.save();

        return res.status(200).json({ status: 200, message: "Order Status Updated SuccessFully...", order: updateOrder });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
}

exports.updateOrderData = async (req, res) => {
    try {
        const id = req.params.id;

        const { orderDetails, ...updateFields } = req.body;

        if (!orderDetails || !Array.isArray(orderDetails)) {
            return res.status(401).json({ status: 401, message: "Invalid or missing orderDetails" });
        }

        let updateOrderData = await order.findById(id);

        if (!updateOrderData) {
            return res.status(404).json({ status: 404, message: "Order not found" });
        }

        Object.assign(updateOrderData, updateFields);

        updateOrderData.orderDetails = [
            ...updateOrderData.orderDetails,
            ...orderDetails
        ];

        const updatedOrder = await updateOrderData.save();

        return res.status(200).json({ status: 200, message: "Order updated successfully", order: updatedOrder });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};

exports.removeItems = async (req, res) => {
    try {
        let orderId = req.params.id

        let { articalId } = req.body

        let chekOrder = await order.findById(orderId)

        if (!chekOrder) {
            return res.status(404).json({ status: 404, message: "Order Not Found" })
        }

        chekOrder = await order.findByIdAndUpdate(
            orderId,
            { $pull: { orderDetails: { ArticalId: articalId } } },
            { new: true }
        );

        return res.status(200).json({ status: 200, message: "Order Items Remove SuccessFully..." })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
}

exports.removeItems = async (req, res) => {
    try {
        let id = req.params.id

        let checkOrderDetailId = await order.findOne({ 'orderDetails._id': id })

        if (!checkOrderDetailId) {
            return res.status(404).json({ status: 404, message: "OrderDetail Not Found" })
        }

        chekOrder = await order.findOneAndUpdate(
            { 'orderDetails._id': id },
            { $pull: { orderDetails: { _id: id } } },
            { new: true }
        );

        return res.status(200).json({ status: 200, message: "Order Items Remove SuccessFully..." })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
}

exports.deleteOrder = async (req, res) => {
    try {
        let id = req.params.id;

        let chekOrder = await order.findById(id);

        if (!chekOrder) {
            return res.status(404).json({ status: 404, message: "Order Not Found" })
        }

        await order.findByIdAndDelete(id);

        return res.status(200).json({ status: 200, message: "Order Deleted Successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
}

exports.getStatusWiseData = async (req, res) => {
    try {
        let type = req.query.type

        if (type === 'received') {

            let chekcRecivedData = await order.find({ status: "received" })

            let count = chekcRecivedData.length;

            return res.status(200).json({ status: 200, totalRecuvedData: count, message: "All Receved Data", order: chekcRecivedData });

        }
        if (type === 'prepared') {

            let chekcPreparedData = await order.find({ status: "prepared" })

            let count = chekcPreparedData.length;

            return res.status(200).json({ status: 200, totalPreparedData: count, message: "All Prepared Data", order: chekcPreparedData });

        }
        if (type === 'delivered') {

            let chekcDeliveredData = await order.find({ status: "delivered" })

            let count = chekcDeliveredData.length;

            return res.status(200).json({ status: 200, totalDeliveredData: count, message: "All Delivered Data", order: chekcDeliveredData });

        }
        if (type === 'finalized') {

            let chekcFinalizedData = await order.find({ status: "finalized" })

            let count = chekcFinalizedData.length;

            return res.status(200).json({ status: 200, totalFinalizedData: count, message: "All Finalized Data", order: chekcFinalizedData });
        }

        if (type === 'cancelled') {

            let chekcCancelledData = await order.find({ status: "cancelled" })

            let count = chekcCancelledData.length;

            return res.status(200).json({ status: 200, totalCancelledData: count, message: "All Cancelled Data", order: chekcCancelledData });
        }

        let checkOrderData = await order.find();

        let count = checkOrderData.length;

        return res.status(200).json({ status: 200, totalOrder: count, message: "All Order Found SuccessFully...", order: checkOrderData });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
}

exports.createTipAmount = async (req, res) => {
    try {
        let id = req.params.id;

        let { tipAmount } = req.body;

        let chekOrderId = await order.findById(id);

        if (!chekOrderId) {
            return res.status(404).json({ status: 404, message: "Order Not Found" })
        }

        chekOrderId.tip = tipAmount;

        chekOrderId.save();

        return res.status(200).json({ status: 200, message: "TipAmount Created SuccessFully..", tipAmount: chekOrderId })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};

exports.totalIncome = async (req, res) => {
    try {
        
        const orders = await order.find().populate('orderDetails.ArticalId');

        let sale = 0;
        let cost = 0;

        orders.forEach(order => {
            order.orderDetails.forEach(detail => {
                sale += detail.quantity * detail.ArticalId.salePrice;
                cost += detail.quantity * detail.ArticalId.costPrice;
            });
        });

        let getTotalIncome = sale - cost

        return res.status(200).json({ status: 200, totalRevenu: sale, totalSalePrice: sale, totalCostPrice: cost, TotalIncome: getTotalIncome, });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
}

exports.createNote = async (req, res) => {
    try {
        let id = req.params.id;

        let { notes } = req.body;

        let createNotes = await order.findOneAndUpdate(
            { 'orderDetails._id': id },
            { $set: { 'orderDetails.$.notes': notes } },
            { new: true }
        );

        if (createNotes.nModified === 0) {
            return res.status(404).json({ status: 404, message: "Order Details Not Found" });
        }

        return res.status(200).json({ status: 200, message: "Notes Created successfully", order: createNotes });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
}