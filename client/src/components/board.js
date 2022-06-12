import { useEffect, useState } from "react"
import Square from "./square"

const Board = (props) => {

    // const ROWS = 3
    // const COLM = 3
    const boardStart  = [
        ['', '', ''], 
        ['', '', ''] , 
        ['', '', '']
    ]
    const [board, setBoard] = useState(boardStart)

    useEffect(() => {

        props.socket.on("update_board", (board) => {
            
            setBoard(() => [...board])
        })
    }, [props.socket])

    // update board and validate winner in the server- send back board from server
    const handleClick = (row, col) => {

    props.socket.emit("move_made",{"row":row, "col" : col})

    }



    return(
        <div className="board">

            {
                board.map( (rows,rIndex) => (
                    
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