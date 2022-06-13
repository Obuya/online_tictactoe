import { useEffect, useState } from "react"
import Square from "./square"

const Board = (props) => {

    // update board and validate winner in the server- send back board from server
    const handleClick = (row, col) => {

    props.socket.emit("move_made",{"row":row, "col" : col})

    }



    return(
        <div className="board">

            {
                props.board.map( (rows,rIndex) => (
                    
                    rows.map((col,cIndex) => (
                        <Square 
                        onClick = { props.winner ? null : () => handleClick(rIndex,cIndex)}
                        key={"" + rIndex + cIndex} 
                        id={"" + rIndex + cIndex}
                        value ={col}     
                        />
                    ) )
                ))
            }
        </div>


)}

export default Board