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

        props.socket.on("update_board", (board) => setBoard(() => board))


    }, [props.socket])

    // update board and validate winner in the server- send back board from server
    const handleClick = (row, col) => {
    // if (board[row][col] === '') {
    //     setBoard(
    //         board.map((rows, rIndex) => (
    //             rIndex === row ?
    //             rows.map((value, cIndex) => (cIndex === col ? "X" : value)) :
    //             rows
    //         ))
    //  )     

// }

    
    // else{
    //     alert("cant place anymore!!");

    // }

    props.socket.emit("move_made",{"row":row, "col" : col})



    }



    return(
        <>
        <div className="board">

        {
            board.map( (rows,rIndex) => (
                
                rows.map((col,cIndex) => (
                    <Square 
                    onClick = { () => handleClick(rIndex,cIndex)}
                    key={"" + rIndex + cIndex} 
                    id={"" + rIndex + cIndex} 
                    value ={col}     
                    />
                ) )
            ))
        }


        </div>
        </>


)}

export default Board