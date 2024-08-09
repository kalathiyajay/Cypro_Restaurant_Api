const walletLog = require('../models/walletLogModels');
const wallet = require('../models/walletModels');

exports.createWalletLog = async (req, res) => {
    try {
        let { transcationId, walletId, creditAmount, transcationType } = req.body;

        let checkWallet = await walletLog.findOne({ transcationId: transcationId })

        if (checkWallet) {
            return res.status(401).json({ status: 401, message: "Wallet Log Alredy Added.." })
        }

        checkWallet = await walletLog.create({
            transcationId,
            walletId,
            creditAmount,
            transcationType
        });

        return res.status(201).json({ status: 201, message: "Wallet Log Created SuccessFully..", walletLog: checkWallet });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }

}

exports.getallWalletLog = async (req, res) => {
    try {
        let page = parseInt(req.query.page);
        let pageSize = parseInt(req.query.pageSize);

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedWalletLog;

        paginatedWalletLog = await walletLog.find();

        let count = paginatedWalletLog.length;

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "Wallet Log Not Found" })
        }

        if (page && pageSize) {
            startIndex = (page - 1) * pageSize
            lastIndex = (startIndex + pageSize)
            paginatedWalletLog = paginatedWalletLog.slice(startIndex, lastIndex);
        }

        return res.status(200).json({ status: 200, allWalletLog: count, message: "All Wallet Log Found SuccessFully...", walletLogs: paginatedWalletLog })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
}

exports.getWalletLog = async (req, res) => {
    try {
        let id = req.params.id;

        let getWalletId = await walletLog.findById(id);

        if (!getWalletId) {
            return res.status(404).json({ status: 404, message: "Wallet Log Not Found" })
        }

        return res.status(200).json({ status: 200, message: "Wallet Log Found SuccessFully...", walletLog: getWalletId });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
}

exports.updateWalletLog = async (req, res) => {
    try {
        let id = req.params.id;

        let changeWalletLogData = await walletLog.findById(id);

        if (!changeWalletLogData) {
            return res.status(404).json({ status: 404, message: "Wallet Log Not Found" });
        }

        changeWalletLogData = await walletLog.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.status(200).json({ status: 200, message: "Wallet Log Updated SuccessFully...", walletLog: changeWalletLogData })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.deleteWalletLog = async (req, res) => {
    try {
        let id = req.params.id;

        let removeWalletLog = await walletLog.findById(id);

        if (!removeWalletLog) {
            return res.status(404).json({ status: 404, message: "Wallet Log Not Found" });
        }

        await walletLog.findByIdAndDelete(id);

        return res.status(200).json({ status: 200, message: "Wallet Log Deleted SuccessFully..." });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getUserWalletLog = async (req, res) => {
    try {
        let id = req.params.id;

        let wallets = await wallet.find({ userId: id });

        if (!wallets) {
            return res.status(404).json({ status: 404, message: "User Not Found" })
        }

        let walletUserData = [];

        for (let wallett of wallets) {
            let logs = await walletLog.find({ walletId: id })
            wallett = logs;
            walletUserData.push(wallett);
        }

        return res.json({ status: 200, message: "Wallet Data Found SuccessFully..", userWallet: walletUserData });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}