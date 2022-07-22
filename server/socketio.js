const {
    Server
} = require("socket.io");
const getArrLetters = require('./Routes/getArrLetters');
module.exports.io = {
    getIo: (server) => {
        const io = new Server(server, {
            cors: {
                origin: "http://localhost:3000",
                methods: ["GET", "POST"],
            },
        });

        io.on("connection", (socket) => {

            socket.on("get_room", data => {
                //join the room
                socket.join(data.room);
                //set data
                socket._username = data.username;
                socket._roomKey = data.room;
                // console.log(socket);

                const getData = async() => {
                    var clients = await io.in(data.room).fetchSockets();
                    var clientslen = clients.length;

                    if (clientslen == 1) {
                        socket._role = true;
                    } else {
                        socket._role = false;
                    }
                    socket._emo = clientslen - 1;


                    //get random animal

                    var userList = await clients.map((client) => {
                        var user = {
                            username: client._username,
                            score: 0,
                            role: client._role,
                            emo: socket._emo,
                        }

                        return user;
                    })
                    socket._userlist = userList;
                    const role = socket._role;

                    //io.to sends to everyone on room while socket.to sends to everyone except self
                    await io.to(data.room).emit("update_list", userList);
                    console.log("role is", role);
                    await socket.emit("get_role", role);

                }
                getData();

            })

            socket.on("req_join", () => {
                io.to(socket._roomKey).emit("all_join");
            })

            socket.on("req_sendMsg", ({
                username,
                msg,
                flag
            }) => {
                console.log(username, msg, flag);
                io.to(socket._roomKey).emit("get_msg", {
                    username,
                    msg,
                    flag
                });
            })

            socket.on("req_letters", () => {
                const arrLetters = getArrLetters();
                io.to(socket._roomKey).emit("get_letters", {
                    arrLetters
                })
            })

        })
        return io;
    }
}