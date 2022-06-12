const express = require('express')
const app = express()
const http = require("http")
const { Server } = require('socket.io')
const cors = require("cors")
const { Socket } = require('engine.io')
app.use(cors())


const server = http.createServer(app)
const users = new Map()

const boardDefault = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
]

const updateBoard = (row, col, client) => {
    if (boardDefault[row][col] === '') {
        
        boardDefault[row][col] = client === users.get('room')[0] ? 'x' : 'o'
    }

}

const clearBoard =  () => {

    for(let i = 0; i < boardDefault.length; i++){
        
        for(let j = 0; j < boardDefault[0].length; j++){

            boardDefault[i][j] = ''
        }
    }
}

const io = new Server(server, {

    cors: {

        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
})

io.on("connect", (socket) => {

    io.to(socket.id).emit("join", users.has("room") ? users.get("room"): false )


    socket.on("connect", (data) => {
        console.log(`${socket.id} has connected ${users.has("room")}`);
        
    })

    socket.on("move_made", (move) => {


        updateBoard(move.row, move.col, socket.id)

        io.in("room").emit("update_board", [...boardDefault])


    })

    socket.on("create_room", (room) => {

        clearBoard()

        if (users.has(room) === true) {

            if (users.get(room).length >= 2) {


            }
            else {

                socket.join(room)
                console.log(users)
                users.set(room, [...io.sockets.adapter.rooms.get(room)])
                io.in("room").emit("join_room", users.get("room") )
                console.log(`${socket.id} has 1joined ${room}`);
            }
        }
        else {
            socket.join(room)
            users.set(room, [...io.sockets.adapter.rooms.get(room)])
            io.to("room").emit("host_room", users.get("room"))
            io.emit("join", users.get("room"))
            console.log(`${socket.id} 2has joined ${room}`)
        }
        console.log(users,"sdsd")

    })

    socket.on("disconnect", (reason) => {
        clearBoard()
        io.emit("update_board", [...boardDefault])
        console.log(`${socket.id} has left`);
        console.log(users, "users")
        users.has("room") && users.get("room").includes(socket.id) && ( users.get("room").length > 1 ? users.set("room", [...io.sockets.adapter.rooms.get("room")]) : users.delete("room") )
        console.log(users)
        io.emit("exit", users.has("room") ? users.get("room") : false)
    });

})




server.listen(3001, () => console.log("server is running! http://localhost:3001"))