const { Server } = require('socket.io');

const connectTable = () => {
    const io = new Server();

    io.on('connection', (socket) => {
        console.log('a user connected', socket.id);

        socket.emit("welcome", "Welcome")

        socket.on('message', message => {
            console.log('Table:' + message)
            socket.broadcast.emit('message', `Table Selected ${message}`)
        })

        socket.on('joinGroup', (group) => {
            socket.join(group);
            console.log(`User ${socket.id} joined group ${group}`);
            socket.emit('message', `Joined group ${group}`);
        });

        socket.on('createGroup', (group) => {
            socket.join(group);
            console.log(`Group ${group} created by ${socket.id}`);
            socket.emit('message', `Group ${group} created`);
        });

        socket.on('sendMessage', (data) => {
            console.log(data);
            io.to(data.group).emit('GroupMessage', data.message)
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });

    io.listen(3000);
}

module.exports = connectTable;


