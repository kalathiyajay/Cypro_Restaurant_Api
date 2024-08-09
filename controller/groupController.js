const groupForChat = require('../models/GroupForChatModels');
const userGroupJoin = require('../models/userGroupJoinModels');

exports.createGroupForChat = async (req, res) => {
    try {
        let { name, photo } = req.body;

        let checkGroup = await groupForChat.findOne({ name: name })

        if (checkGroup) {
            return res.status(401).json({ status: 401, message: "Group For Chat Alredy Created.." })
        }

        if (!req.file) {
            return res.status(401).json({ status: 401, message: "Please Upload Photo" })
        }

        checkGroup = await groupForChat.create({
            name,
            photo: req.file.path
        });

        return res.status(201).json({ status: 201, message: "Group For Chat Created SuccessFully...", groupForChat: checkGroup })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
};

exports.getAllGroupForChat = async (req, res) => {
    try {
        let page = parseInt(req.query.page);
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedGroupForChat

        paginatedGroupForChat = await groupForChat.find();

        let count = paginatedGroupForChat.length;

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "Group For Chat Not Found" })
        }

        if (page && pageSize) {
            startIndex = (page - 1) * pageSize
            latsIndex = (startIndex + pageSize)
            paginatedGroupForChat = paginatedGroupForChat.slice(startIndex, latsIndex);
        }

        return res.status(200).json({ status: 200, totalGroupForChat: count, message: "All Group For Chat Found SuccessFully...", groupForChats: paginatedGroupForChat });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.updateGroupForChat = async (req, res) => {
    try {
        let id = req.params.id;

        let updateGroupData = await groupForChat.findById(id);

        if (!updateGroupData) {
            return res.status(404).json({ status: 404, message: "Group For Chat Not Found" })
        }

        if (req.file) {
            req.body.photo = req.file.path
        }

        updateGroupData = await groupForChat.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.status(200).json({ status: 200, message: "Group For Chat Updated SuccessFully..", groupForChat: updateGroupData })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.deleteGropuForChat = async (req, res) => {
    try {
        let id = req.params.id;

        let removeGropuForChat = await groupForChat.findById(id)

        if (!removeGropuForChat) {
            return res.status(404).json({ status: 404, message: "Group For Chat Not Found" })
        }

        await groupForChat.findByIdAndDelete(id);

        return res.status(200).json({ status: 200, message: "Group For Chat Delete SuccessFully..." });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.addUser = async (req, res) => {
    try {
        let { groupId, userId } = req.body;

        let chekUserGroup = await userGroupJoin.findOne({ groupId, userId })

        if (chekUserGroup) {
            return res.status(401).json({ status: 401, message: "User Is alredy added In Group" });
        }

        chekUserGroup = await userGroupJoin.create({
            groupId,
            userId
        });

        return res.status(201).json({ status: 201, message: "User Added SuccessFully...", userGroupJoin: chekUserGroup });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const { groupId, userId } = req.body;

        if (!groupId || !userId) {
            return res.status(401).json({ status: 401, message: 'Group ID and User ID are required' });
        }

        const removeUser = await userGroupJoin.findOneAndUpdate(
            { groupId },
            { $pull: { userId: userId } },
            { new: true }
        );

        if (!removeUser) {
            return res.status(404).json({ status: 404, message: 'Group not found' });
        }

        return res.status(200).json({ status: 200, message: 'User removed successfully', userGroupJoin: removeUser });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getMyGroup = async (req, res) => {
    try {
        let id = req.params.id

        let findUser = await userGroupJoin.find({ userId: { $in: id } });

        if (!findUser) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }

        return res.status(200).json({ status: 200, message: "Get All My Groups", getMyGroup: findUser })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getGroupChat = async (req, res) => {
    try {
        let id = req.params.id;

        let checkGroup = await groupForChat.findById(id);

        if (!checkGroup) {
            return res.status(404).json({ status: 404, message: "Group Not Found" })
        }

        let checkGroupChat = await userGroupJoin.find({ groupId: id });

        if (!checkGroupChat) {
            return res.status(404).json({ status: 404, message: "Group For Chat Not Found" })
        }

        return res.status(200).json({ status: 200, message: "Group Chat Found SuccessFully..", gorupChat: checkGroupChat });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
}