import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

import Modal from "react-bootstrap/Modal";
import { useState } from "react";

function Board(props) {
  const [modalShow, setModalShow] = useState(false);

  // delete board from database, function passed through props
  function deleteFN() {
    props.deleteFromDB(props.boardID);
  }

  // show modal
  const onShow = () => {
    setModalShow(true);
  };

  // hide modal
  const onHide = () => {
    setModalShow(false);
  };

  // hide modal and delete board 
  // this is the function that is called when the user confirms deletion
  const onHideConfirm = () => {
    setModalShow(false);
    deleteFN();
  };

  return (
    <Card style={{ width: "18rem" }}>
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text>{props.description}</Card.Text>
        <Link to={"../board/" + props.boardID} relative="path">
          <Button variant="primary">See Notes</Button>
        </Link>
      </Card.Body>

      <Button variant="danger" onClick={onShow}>
        Delete
      </Button>

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
            Selecting confirm will delete the board. This action cannot be
            undone.
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
