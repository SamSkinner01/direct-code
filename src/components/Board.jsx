import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";


function Board(props) {

    function deleteFN(){
        props.deleteFromDB(props.boardID);
    }

  return (
    <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text>
            {props.description}
        </Card.Text>
        <Button variant="primary">Go somewhere</Button>
      </Card.Body>
    
      <Button variant="danger" onClick={deleteFN}>Delete</Button>
      <Link to={"../board/" + props.boardID} relative="path">
      Go to board
    </Link>
    </Card>
  );
}

export default Board;