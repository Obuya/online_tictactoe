import './App.css'
import Board from './components/board'
import io from 'socket.io-client'

import {
  useEffect,
  useState
} from 'react'

//server
// "https://obuyatictactoe.herokuapp.com"
const socket = io.connect("http://localhost:3001")




function App() {
  const [name, setName] = useState("")
  const [oppName, setOppName] = useState("")
  const [players, setPlayers] = useState([])
  const [turn, setTurn] = useState(null)
  const [winner, setWinner] = useState(false)
  const [board, setBoard] = useState(null)

    useEffect(() => {

      socket.on("win", (data)=>{

        console.log(data.player, "made it here");
        setWinner(data.winner)
        alert(`${socket.id === data.winner ? "You Won!!!!" : "You Lost :(("}`)
  
      })
    socket.on("connected", (data) => {

      setName(socket.id)
      setPlayers(data)
    }) 

    socket.on("update_game", (data) => {

       console.log("made it here after win");
        setBoard(data.board)
        setTurn(socket.id === data.turn ? true: false )
        setWinner(data.winner)
      
    })
    socket.on("joined_room", (data) => {

      setPlayers(data.players)
      setOppName(data.players[0] === socket.id ? data.players[1] : data.players[0] ) 
      setBoard(data.board)
      setTurn(socket.id === data.turn ? true: false )

    })
    
    socket.on("created_room", (data) => {
      console.log(data);
      setPlayers(data)
      setName(() => data[0])
    })

    // socket.on("exit", (data) => {

    //   if (data !== false) {
    //     setRoomExists(() => false)
    //     setPlayers(() => data.length)
    //   } else {
    //     setRoomExists(() => false)
    //     setPlayers(() => 0)
    //   }

    // })

  },[socket])

  // useEffect(() => {


  // }, [players])

  // useEffect(() => {
   


  // }, [name])




  const joinRoom = () => {
    players == 0 ? socket.emit("create_room", "room") : socket.emit("join_room", "room")
  }


  return (
    <div className="App">
      <h2 className="title">Tic Tac1 Toe</h2>
      <h4 className='player'>i am: {name}</h4>
      {
        // render game board only when there are 2 players connected
      (players.length === 2) ? 
      <>
      <h4 className='turn'>{turn ? "Your": "Opp's"} Turn</h4>
      <Board socket = {socket} winner = {winner} board = {board}/> 
      <h4 className='opp'>playing against: {oppName}</h4>
      </> 
        : players.length === 1 && players.includes(name)  ?  <h4>waiting for opp....</h4> : <button onClick={joinRoom}>{ players.length === 1 ? "Join" : "Start"} Game</button>
      
      }
    </div>
  )
}

export default App;
