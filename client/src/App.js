import './App.css'
import Board from './components/board'
import io from 'socket.io-client'

import {
  useEffect,
  useState
} from 'react'

const socket = io.connect("http://localhost:3001")



function App() {
  const [name, setName] = useState("")
  const [oppName, setOppName] = useState("")
  const [roomExists, setRoomExists] = useState(false)
  const [players, setPlayers] = useState(0)
  const [turn, setTurn] = useState(null)
  const [winner, setWinner] = useState(false)

    useEffect(() => {

    socket.on("update_turn", (data) => {

        setTurn(() => socket.id === data ? true: false )
      
    })

    socket.on("join", (data) => {

      setName(() => socket.id)
      if (data !== false) {
        setRoomExists(() => true)
        console.log(data)
      } else {
        setRoomExists(() => false)
      }
    })

    socket.on("exit", (data) => {

      if (data !== false) {
        setRoomExists(() => false)
        setPlayers(() => data.length)
      } else {
        setRoomExists(() => false)
        setPlayers(() => 0)
      }

    })

    socket.on("host_room", (data) => {
      setPlayers(() => data.length)
      name === data[0] ? setOppName(() => data[1]) : setOppName(() => data[0])

      console.log(data);
    })

    socket.on("join_room", (data) => {

      setPlayers(() => data.length)
      name === data[0] ? setOppName(() => data[1]) : setOppName(() => data[0])
    })
  },[socket])

  useEffect(() => {
    socket.on("win", (data)=>{

      console.log(name, "made it here");
      setWinner(() => data.winner)
      name && alert(`${name === data.winner ? "You Won!!!!" : "You Lost :(("}`)

    })


  }, [name])




  const joinRoom = () => {
    socket.emit("create_room", "room")
    console.log(players);
  }


  return (
    <div className="App">
      <h2 className="title">Tic Tac Toe</h2>
      <h4 className='player'>i am: {name}</h4>
      {
        // render game board only when there are 2 players connected
      (players === 2) ? 
      <>
      <h4 className='turn'>{turn ? "Your": "Opp's"} Turn</h4>
      <Board socket = {socket} winner = {winner}/> 
      <h4 className='opp'>playing against: {oppName}</h4>
      </> 
        : players === 1 ? <h4>waiting for opp....</h4> : <button onClick={joinRoom}>{roomExists ? "Join" : "Start"} Game</button>
      
      }
    </div>
  )
}

export default App;
