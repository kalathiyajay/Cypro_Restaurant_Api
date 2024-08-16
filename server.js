require('dotenv').config();
const express = require('express');
const connectDB = require('./db/db');
const indexRouter = require('./routes/index.routes');
const path = require('path');
const connectTable = require('./socketIo');
const server = express();
const port = process.env.PORT || 4000
const http = require('http')
const SERVER = http.createServer(server);


server.use(express.json());
server.use('/public', express.static(path.join(__dirname, 'public')))
server.use('/api', indexRouter);

connectTable(SERVER);
server.listen(port, () => {
    connectDB();
    console.log(`Server Is connected At ${port}`);
});   