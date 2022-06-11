import './App.css'
import Board from './components/board'
import io from 'socket.io-client'

import { useEffect, useState } from 'react'

const socket  = io.connect("http://localhost:3001")




function App() {

  const [renderBoard, setRenderBoard] = useState(false)
  const [name, setName] = useState("")
  const [oppName, setOppName] = useState("")

  useEffect(() => {

    socket.emit("ping" , () => console.log("this"))

    socket.on("connected", (data) => {
      setName( () => socket.id)
    });

    socket.on("opp_found",(opp) => {

      setOppName(() => opp)
      console.log(opp);
    } )


  }, [socket])

const joinRoom = () => {
    socket.emit("create_room", "room")
}


  return (
    <div className="App">
      <h2 className="title">Tic Tac Toe</h2>
      <h4>i am: {name}</h4>
      {oppName !='' ? <> <Board socket = {socket}/> <h4>playing against: {oppName}</h4></>
        :<button onClick={joinRoom}>Start a Game</button> }
    </div>
  );
}

export default App;
