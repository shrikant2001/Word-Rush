//
const express = require("express");
const cors = require("cors");
const http = require("http");
const socket = require('./socketio.js');
const bodyParser = require('body-parser');

//
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
const server = http.createServer(app);
const io = socket.io.getIo(server); //to make socket separately
//
const wordRouter = require('./Routes/wordRouter.js')
app.use('/', wordRouter);
server.listen(3001, () => {
    console.log("listening on 3001");
});