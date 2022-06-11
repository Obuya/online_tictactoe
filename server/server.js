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

const updateBoard = (row, col) => {
    if (boardDefault[row][col] === '') {
        
        boardDefault[row][col] = 'x'
    }

}

const clearBoard =  () => {

    for(let i = 0; i < boardDefault; i++){
        
        for(let j = 0; j < boardDefault[0]; j++){

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


io.on("connection", (socket) => {

    socket.on("ping", () => {

        socket.emit("connected")

        console.log(`${socket.id} has connected`);

    })

    socket.on("move_made", (move) => {


        updateBoard(move.row, move.col)

        io.in("room").emit("update_board", [...boardDefault])


    })

    socket.on("create_room", (room) => {

        if (users.has(room) === true) {

            if (users.get(room).length >= 2) {


            }
            else {

                socket.join(room)
                clearBoard()
                users.set(room, [...io.sockets.adapter.rooms.get(room)])
                io.to(users.get(room)[0]).emit("opp_found", users.get(room)[1])
                io.to(users.get(room)[1]).emit("opp_found", users.get(room)[0])
                console.log(`${socket.id} has joined ${room}`);
            }
        }
        else {
            socket.join(room)
            users.set(room, [...io.sockets.adapter.rooms.get(room)])
            console.log(`${socket.id} has joined ${room}`)
        }
        // users.set(room, [...io.sockets.adapter.rooms.get(room)])
        console.log(users)

    })

    socket.on("disconnect", (reason) => {
        console.log(`${socket.id} has left`);
    });

})




server.listen(3001, () => console.log("server is running! http://localhost:3001"))