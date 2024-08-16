const { Server } = require('socket.io');

const connectTable = () => {
    const io = new Server();

    io.on('connection', (socket) => {
        console.log('a user connected', socket.id);

        socket.emit("welcome", "Welcome")

        socket.on('message', message => {
            console.log('Table:' + message)
            socket.broadcast.emit('message', message)
        })

        socket.on('joinGroup', (group) => {
            if (group) {
                socket.join(group);
                console.log(`User ${socket.id} joined group ${group}`);
                socket.emit('message', `Joined group ${group}`);
            } else {
                console.log('Group name is undefined or empty');
            }
        });

        socket.on('createGroup', (group) => {
            if (group) {
                socket.join(group);
                console.log(`Group ${group} created by ${socket.id}`);
                socket.emit('message', `Group ${group} created`);
            } else {
                console.log('Group name is undefined or empty');
            }
        });

        socket.on('sendMessage', (data) => {
            if (!data || !data.group || !data.message) {
                console.error('Invalid data received:', data);
                return;
            }

            console.log(`Message from ${socket.id} to group ${data.group}: ${data.message}`);

            try {
                io.to(data.group).emit('message', {
                    sender: socket.id,
                    message: data.message
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


