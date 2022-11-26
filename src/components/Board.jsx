import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";

import Modal  from 'react-bootstrap/Modal';
import {useState} from 'react';

function Board(props) {

    const [modalShow, setModalShow] = useState(false);
    
    function deleteFN(){
        props.deleteFromDB(props.boardID);
    }

    const onShow = () => {
        setModalShow(true);
    }

    const onHide = () => {
        setModalShow(false);
    }

    const onHideConfirm = () => {
        setModalShow(false);
        deleteFN();
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
      <Button variant="danger" onClick={onShow}>Delete</Button>

      <Modal 
      show={modalShow} 
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Delete A Board
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Selecting confirm will delete the board. This action cannot be undone.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHideConfirm}>Confirm</Button>
      </Modal.Footer>
    </Modal>

    </Card>
  );
}

export default Board;