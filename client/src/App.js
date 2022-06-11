import './App.css'
import Board from './components/board'
import io from 'socket.io-client'

import { useEffect, useState } from 'react'

const socket  = io.connect("http://localhost:3001")




function App() {

  const [renderBoard, setRenderBoard] = useState(false)
  const [name, setName] = useState("")
  const [oppName, setOppName] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {

    socket.emit("ping" , () => console.log("this"))

    socket.on("connected", (data) => {
      // setRenderBoard(() => data.connected)
      // console.log(data.connected)
      // setOpp(() => data.opp)
      // setMessage(data.message)
      setName( () => socket.id)
    });
  }, [socket])

const joinRoom = () => {
    socket.emit("join_room", {"room": "room"})
  console.log("clicked")
  
}


  return (
    <div className="App">
      <h2 className="title">Tic Tac Toe</h2>
      <h4>i am: {name}</h4>
      {renderBoard ? (oppName !='' ? <> <Board/> <h4>playing against: {oppName}</h4></> :<h4>{message}</h4>)
        :<button onClick={joinRoom}>Start a Game</button> }
    </div>
  );
}

export default App;
