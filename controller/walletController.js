const wallet = require('../models/walletModels');

exports.createWallet = async (req, res) => {
    try {
        let { userId, credit } = req.body;

        let chekcWalletData = await wallet.findOne({ userId: userId })

        if (chekcWalletData) {
            return res.status(401).json({ status: 401, message: "Wallet Is Alredy Added.." });
        }

        chekcWalletData = await wallet.create({
            userId,
            credit
        });

        return res.status(201).json({ status: 201, message: "Wallet Created SuccessFully...", wallet: chekcWalletData });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllWallet = async (req, res) => {
    try {
        let page = parseInt(req.query.page);
        let pageSize = parseInt(req.query.pageSize);

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedWallet;

        paginatedWallet = await wallet.find();

        let count = paginatedWallet.length;

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "Wallet Not Found" });
        }

        if (page && pageSize) {
            startIndex = (page - 1) * pageSize
            lastIndex = (startIndex + pageSize)
            paginatedWallet = paginatedWallet.slice(startIndex, lastIndex);
        }

        return res.status(200).json({ status: 200, totalWallet: count, message: "All Wallet Found SuccessFully...", wallet: paginatedWallet });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
};

exports.getWallet = async (req, res) => {
    try {
        let id = req.params.id;

        let getWallet = await wallet.findById(id);

        if (!getWallet) {
            return res.status(404).json({ status: 404, message: "Wallet Not Found" })
        }

        return res.status(200).json({ status: 200, message: "Wallet Found SuccessFully...", wallet: getWallet });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
}

exports.updateWallet = async (req, res) => {
    try {
        let id = req.params.id;

        let changeData = await wallet.findById(id);

        if (!changeData) {
            return res.status(404).json({ status: 404, message: "Wallet Not Found" });
        }

        changeData = await wallet.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.status(200).json({ status: 200, message: "Wallet Updated SuccesFully...", wallet: changeData });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.deleteWallet = async (req, res) => {
    try {
        let id = req.params.id;

        let removeData = await wallet.findById(id);

        if (!removeData) {
            return res.status(404).json({ status: 404, message: "Wallet Not Found" })
        }

        await wallet.findByIdAndDelete(id);

        return res.status(200).json({ status: 200, message: "Wallet Deleted SuccessFully.." });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}