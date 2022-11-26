function Item(props, index, completeItem){

    return(
        <div
            style={{ textDecoration: props.item.isCompleted ? "line-through" : "" }}
        >
            {props.item}
            <div>
        <button onClick={() => completeItem(index)}>Complete</button>
      </div>
        </div>
    );
}

export default Item;