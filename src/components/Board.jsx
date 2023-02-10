import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import "../css/displayBoard.css";
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
            <div class="descriptors">
              <Card.Title>{props.title}</Card.Title>
              <Card.Text>{props.description}</Card.Text>
            </div>
            <div class="card-header">
            <div class="card-header__left">
              <Link to={"../board/" + props.boardID} relative="path">
                <Button variant="btn btn-primary btn-lg">View</Button>
              </Link>
            </div>
            <div class="card-header__right">
              <Button variant="btn btn-danger btn-lg" onClick={onShow}>
                Delete
              </Button>
            </div>
          </div>
        </Card.Body>
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
          <p class="modal-title">
            Selecting confirm will delete the board. This action cannot be
            undone.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button class="modal-title" onClick={onHideConfirm}>Confirm</Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
}

export default Board;
