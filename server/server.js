const express = require('express')
const app = express()
const http = require("http")
const {
    Server
} = require('socket.io')
const cors = require("cors")
const {
    Socket
} = require('engine.io')

app.use(cors())


const server = http.createServer(app)
const users  = []


const io = new Server(server, {

    cors: {

        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
})


io.on("connection", (socket) => {

    socket.on("ping", () => socket.emit("connected"))

    socket.on("join_room", (data) => {

        // first checks if room exists
        if (io.sockets.adapter.rooms.get(data.room)) {

            // checks number of connections to room must be less than 2
            if (io.sockets.adapter.rooms.get(data.room).size < 2) {
                socket.join(data.room)
                console.log(
                    `
                    ${socket.id} joined ${data.room}. \n
                    ${data.room} has ${io.sockets.adapter.rooms.get(data.room).size} clients. 
                    
                    `
                )
                console.log([...io.sockets.adapter.rooms.get(data.room)][0]);
                io.to(data.room).emit("connected", {
                    ...data,
                    "connected":true,
                    "opp" : {"name": socket.id, "status": true}
                })
            
            //room is full dont connent another player
            } else {
                socket.emit("connected", {
                    ...data,
                    "connected": false,
                    "opp" : {"name": socket.id, "status": true},
                    "message" : "Game lobby full!!"
                })
            }

        }
        //creates a new room and adds a person
        else {
            socket.join(data.room)
            console.log("new room size: ", io.sockets.adapter.rooms.get(data.room).size);
            io.to(data.room).emit("connected", {
                ...data,
                "connected": true,
                "opp" : {"name": socket.id, "status": false },
                "message" : "Waiting for another opp..."
            })   
        }

        socket.on('disconnect', (data) => {
            io.to("room").emit("connected", {
                "connected":true,
                "opp" : {"name": socket.id, "status": false },
                "message" : "opp left! Waiting for another opp..."
            })

            console.log(data)
        })
    })

})




server.listen(3001, () => console.log("server is running! http://localhost:3001"))