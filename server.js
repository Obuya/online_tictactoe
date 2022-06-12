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
const rooms = new Map()
let turn = null
let winner

const boardDefault = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
]

const setupGame = () => {

    turn = rooms.get("room")[0]

}

const checkWin = (client) => {
    winner =  //check first col 
    (boardDefault[0][0] !== '' && boardDefault[0][0] === boardDefault[0][1] && boardDefault[0][1] == boardDefault[0][2]) ? client :
    //check fist row
    (boardDefault[0][0] !== '' && boardDefault[0][0] === boardDefault[1][0] && boardDefault[1][0] === boardDefault[2][0]) ? client : 
    // check diagonal left to right
    (boardDefault[0][0] !== '' && boardDefault[0][0] === boardDefault[1][1] && boardDefault[1][1] === boardDefault[2][2]) ? client :
    // check diagonal right to left
    (boardDefault[0][2] !== '' && boardDefault[0][2] === boardDefault[1][1] && boardDefault[1][1] === boardDefault[2][0]) ? client :
    // check second col
    (boardDefault[0][1] !== '' && boardDefault[0][1] === boardDefault[1][1] && boardDefault[1][1] === boardDefault[2][1]) ? client  :
    // check second row
    (boardDefault[1][0] !== '' && boardDefault[1][0] === boardDefault[1][1] && boardDefault[1][1] === boardDefault[1][2]) ? client :
    //check third col
    (boardDefault[0][2] !== '' && boardDefault[0][2] === boardDefault[1][2] && boardDefault[1][2] === boardDefault[2][2]) ? client :
    // check third row
    (boardDefault[2][0] !== '' && boardDefault[2][0] === boardDefault[2][1] && boardDefault[2][1] === boardDefault[2][2]) ? client : false

console.log(winner);


}

const updateBoard = (row, col, client) => {
    if (boardDefault[row][col] === '' && client === turn) {

        boardDefault[row][col] = client === rooms.get('room')[0] ? 'x' : 'o'
        turn = turn === rooms.get("room")[0] ? rooms.get("room")[1] : rooms.get("room")[0]
        checkWin(client)
    }

}

const clearBoard = () => {

    for (let i = 0; i < boardDefault.length; i++) {

        for (let j = 0; j < boardDefault[0].length; j++) {

            boardDefault[i][j] = ''
        }
    }
}

const io = new Server(server, {

    cors: {

        origin: '*',
        methods: ["GET", "POST"],
    },
}
)

io.on("connect", (socket) => {

    io.to(socket.id).emit("join", rooms.has("room") ? rooms.get("room") : false)


    socket.on("connect", (data) => {
        console.log(`${socket.id} has connected ${rooms.has("room")}`);

    })

    socket.on("move_made", (move) => {


        updateBoard(move.row, move.col, socket.id)
        io.in("room").emit("update_board", [...boardDefault])
        io.in("room").emit("update_turn", turn)
        winner !== false && io.in("room").emit("win", {"winner": winner, "player": socket.id})
        console.log(boardDefault);


    })

    socket.on("create_room", (room) => {

        clearBoard()
        winner = false

        if (rooms.has(room) === true) {

            if (rooms.get(room).length >= 2) {


            } else {

                socket.join(room)
                console.log(rooms)
                rooms.set(room, [...io.sockets.adapter.rooms.get(room)])
                io.in("room").emit("join_room", rooms.get("room"))
                console.log(`${socket.id} has 1joined ${room}`)
                setupGame()
                io.in("room").emit("update_turn", turn)
            }
        } else {
            socket.join(room)
            rooms.set(room, [...io.sockets.adapter.rooms.get(room)])
            io.to("room").emit("host_room", rooms.get("room"))
            io.emit("join", rooms.get("room"))
            console.log(`${socket.id} 2has joined ${room}`)
        }
        console.log(rooms, "sdsd")

    })

    socket.on("disconnect", (reason) => {
        clearBoard()
        rooms.has("room") && setupGame()
        io.emit("update_board", [...boardDefault])
        console.log(`${socket.id} has left`);
        console.log(rooms, "rooms")
        rooms.has("room") && rooms.get("room").includes(socket.id) && (rooms.get("room").length > 1 ? rooms.set("room", [...io.sockets.adapter.rooms.get("room")]) : rooms.delete("room"))
        console.log(rooms)
        io.emit("exit", rooms.has("room") ? rooms.get("room") : false)
    });

})




server.listen(process.env.PORT || 3001, () => console.log("server is running!", process.env.PORT))
