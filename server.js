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
const { emit } = require('nodemon')
app.use(cors())



const server = http.createServer(app)
const rooms = new Map()
let turn, winner

const boardDefault = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
]

const initGame = () => {

    rooms.set("room",{
        "players" :[],
        "turn" : null, // player id goes here
        "winner": false,
        "board" : [...boardDefault.map((e) => [...e])]
    })

}

const checkWin = (client) => {
    let board = rooms.get("room").board
    winner =  //check first col 
    (board[0][0] !== '' && board[0][0] === board[0][1] && board[0][1] == board[0][2]) ? client :
    //check fist row
    (board[0][0] !== '' && board[0][0] === board[1][0] && board[1][0] === board[2][0]) ? client : 
    // check diagonal left to right
    (board[0][0] !== '' && board[0][0] === board[1][1] && board[1][1] === board[2][2]) ? client :
    // check diagonal right to left
    (board[0][2] !== '' && board[0][2] === board[1][1] && board[1][1] === board[2][0]) ? client :
    // check second col
    (board[0][1] !== '' && board[0][1] === board[1][1] && board[1][1] === board[2][1]) ? client  :
    // check second row
    (board[1][0] !== '' && board[1][0] === board[1][1] && board[1][1] === board[1][2]) ? client :
    //check third col
    (board[0][2] !== '' && board[0][2] === board[1][2] && board[1][2] === board[2][2]) ? client :
    // check third row
    (board[2][0] !== '' && board[2][0] === board[2][1] && board[2][1] === board[2][2]) ? client : false

    rooms.get("room").winner = winner


}

// validates move and updates board and turn
const updateBoard = (row, col, client) => {

    if (rooms.get("room").board[row][col] === '' && client === rooms.get("room").turn) {
            rooms.get("room").board[row][col] = rooms.get("room").players.indexOf(client) === 0 ? 'x' : 'o' // select sign based on index
            rooms.get("room").turn = rooms.get("room").players[1 - rooms.get("room").players.indexOf(client)]  // flip between players
            checkWin(client)
    }

}

const clearBoard = () => {
    
    rooms.get("room").board = [...boardDefault.map((e) => [...e])]
    rooms.get("room").winner = false
    rooms.get("room").turn = rooms.get("room").players[Math.floor(Math.random() * 2)] // randomly select one of the players to start
}

const io = new Server(server, {

    cors: {

        origin: '*',
        methods: ["GET", "POST"],
    },
})

io.on("connect", (socket) => {

    io.emit("connected", rooms.size === 0 ? [] : rooms.get("room").players) // send joined client number of ppl in room


    //on every socket connecttion log who has joined
    socket.on("connect", (data) => {
        console.log(`${socket.id} has connected!`);

    })
    socket.on("move_made", (move) => {
        // update Board data and check for win 
        updateBoard(move.row, move.col, socket.id)
        // check if winner has been flaged then emit back to players if they won or lost
        // if won clear the board as well to start a new game
        if(rooms.get("room").winner !== false){
            io.in("room").emit("win", {"winner": winner, "player": socket.id}) 
            clearBoard() 
            console.log(...boardDefault)
        } 
        //emit updated turn back to cleints
        io.in("room").emit("update_game", {"winner":rooms.get("room").winner, "board": [...rooms.get("room").board], "turn" :rooms.get("room").turn})
    })

    // triggered when user first starts a game
    socket.on("create_room", () => {

        // create room obj
        initGame()
        // join client to socket room and also update room obj with client
        socket.join("room")
        rooms.get("room").players.push(socket.id)
        io.in("room").emit("created_room", [...rooms.get("room").players])
    })

    // triggered when user joins when room alrdy created
    socket.on("join_room", () => {
        socket.join("room")
        rooms.get("room").players.push(socket.id)
        clearBoard()
        io.in("room").emit("joined_room", {"board": [...rooms.get("room").board], "players" :[...rooms.get("room").players], "turn": rooms.get("room").turn })
    })

    socket.on("disconnect", (reason) => {

        //double checks that room still exists and if the disconected socket was a player
        if(rooms.size > 0 && rooms.get("room").players.includes(socket.id)) {

            //removes player from lobby
            rooms.get("room").players =  rooms.get("room").players.filter( (id) => id !== socket.id)
            clearBoard()
           // io.emit("update_board", [...boardDefault])
           // io.emit("exit", rooms.has("room") ? rooms.get("room") : false)
        }        
    })

})




server.listen(process.env.PORT || 3001, () => console.log("server is running! http://localhost:3001"))