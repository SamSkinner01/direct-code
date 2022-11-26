function Item(props) {

    return (
        <div style={{ textDecoration: props.item.isCompleted ? "line-through" : "" }}>
            {props.item.text}
            <div>
                <button onClick={() => props.completeItem(props.index, props.itemID)}>Complete</button>
                <button onClick={() => props.removeItem(props.index, props.itemID)}>x</button>
            </div>
        </div>
    );
}

export default Item;