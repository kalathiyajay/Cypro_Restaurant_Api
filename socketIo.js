const { Server } = require('socket.io');
const Chat = require('./models/chatModels'); // Adjust path as needed
const GroupForChat = require('./models/GroupForChatModels'); // Adjust path as needed
const userGroupJoin = require('./models/userGroupJoinModels');
const connectTable = () => {
    const io = new Server();

    io.on('connection', (socket) => {
        console.log('a user connected', socket.id);

        socket.emit("welcome", "Welcome")

        socket.on('message', message => {
            console.log('Table:' + message)
            socket.broadcast.emit('message', `Table Selected ${message}`)
        })

        socket.on('createGroup', async (groupName) => {
            try {
                const group = new GroupForChat({ name: groupName });
                await group.save();
                const groupId = group._id;
                console.log(groupId);
                socket.join(groupId);
                console.log(`Group ${groupName} created by ${socket.id}`);
                socket.emit('message', `Group ${groupName} created`);
            } catch (error) {
                console.error('Error creating group:', error);
            }
        });

        socket.on('joinGroup', async ({ group, userId }) => {
            try {
                await userGroupJoin.findOneAndUpdate(
                    { groupId: group },
                    { $addToSet: { userId: userId } },
                    { new: true, upsert: true }
                );

                socket.join(group);
                console.log(group);
                console.log(`User ${socket.id} joined group ${group}`);
                socket.emit('message', `Joined group ${group}`);
            } catch (error) {
                console.error('Error joining group:', error);
            }
        });  

        socket.on('sendMessage', async (data) => {
            try {
                const { userId, group, message } = data;

                console.log('Received message:', data);

                const chat = new Chat({
                    senderId: userId,
                    groupId: group,
                    message: message
                });
                await chat.save();
                console.log(`Emitting GroupMessage to room ${group}:`, userId, message);
                io.to(group).emit('groupMessage', {
                    senderId: userId,
                    message: message
                });
            } catch (error) {
                console.error('Error sending message:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });

    io.listen(3000);
}

module.exports = connectTable;


