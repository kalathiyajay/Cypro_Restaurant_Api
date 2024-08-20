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

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });

    io.listen(3000);
}

module.exports = connectTable;


