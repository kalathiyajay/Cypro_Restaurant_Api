const chat = require('../models/chatModels');
const userGroupJoin = require('../models/userGroupJoinModels');
const user = require('../models/user.models');

exports.addGroupChat = async (req, res) => {
    try {
        let id = req.params.id;

        let { senderId, message } = req.body

        let chekGroupId = await userGroupJoin.findOne({ groupId: id })

        if (!chekGroupId) {
            return res.status(401).json({ status: 401, message: "Group Not Found" })
        }

        chekGroupId = await chat.create({
            senderId,
            message
        });

        return res.status(201).json({ status: 201, message: "Message Sent Successfully", chat: chekGroupId });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
}

exports.makeNewChat = async (req, res) => {
    try {
        let id = req.params.id;

        let { receiverid, message } = req.body;

        let cheksenderId = await chat.findOne({ senderId: id })

        if (!cheksenderId) {
            return res.status(401).json({ status: 401, message: "Sender Not Found" })
        }

        cheksenderId = await chat.create({
            senderId: id,
            receiverid,
            message
        });

        return res.status(201).json({ status: 201, message: "Message Sent Successfully", chat: cheksenderId })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
}

exports.getAllChats = async (req, res) => {
    try {
        let page = parseInt(req.query.page);
        let pageSize = parseInt(req.query.pageSize);

        if (page < 1 || pageSize < 1) {
            return res.status(400).json({ status: 400, message: "Page And PageSize Cann't Be Less Than 1" });
        }

        let paginatedChat;

        paginatedChat = await chat.find();

        let count = paginatedChat.length;

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "Chat Not Found" })
        }

        if (page && pageSize) {
            startIndex = (page - 1) * pageSize
            lastIndex = (startIndex + pageSize)
            paginatedChat = paginatedChat.slice(startIndex, lastIndex);
        }

        return res.status(200).json({ status: 200, totalChats: count, message: "All Chats Found SucceessFully..", chat: paginatedChat });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getSpecificUserChat = async (req, res) => {
    try {
        let id = req.params.id

        let checkUser = await user.findById(id)

        if (!checkUser) {
            return res.status(404).json({ status: 404, message: "User Not Found" })
        }

        let getChat = await chat.find({
            $or: [{ senderId: id }, { receiverid: id }]
        });

        if (!getChat) {
            return res.status(404).json({ status: 404, message: "Chat Not Found" })
        }

        return res.status(200).json({ status: 200, message: "Chat Found SuccessFully..", chat: getChat });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}
