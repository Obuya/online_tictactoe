const Square = (props) => {
    return(
        <div className = "square" id ={props.id}  grid-item = {props.gridpos} onClick = {props.onClick}>
            {props.value}
        </div>
    )
}

export default Square
