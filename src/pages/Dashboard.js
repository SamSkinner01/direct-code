import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate, useNavigate } from "react-router-dom";
import "../css/dashboard.css";
import { auth, db } from "../Firebase";
import { logout } from "../userAuth";
import Board from "../components/Board";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
  map,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";

function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [boardsToShow, setBoardsToShow] = useState([]);
  const navigate = useNavigate();

  // closes and reset the modal
  const handleClose = () => {
    setShow(false);
    setTitle("");
    setDescription("");
  };

  // opens the modal
  const handleShow = () => setShow(true);

  // fetches the boards from the database and updates boardsToShow
  const fetchBoards = async () => {
    try {
      const boardsRef = collection(db, "boards");
      const q = query(boardsRef, where("uid", "==", user.uid));
      const docs = await getDocs(q);
      const boards = docs.docs.map((item) => item.data());
      setBoardsToShow(boards.length > 0 ? boards : []);
    } catch (err) {
      console.log(err);
    }
  };

  // adds a new board to the database
  function addBoardToDB() {
    if (title === "") {
      alert("Please fill out the title field");
      return;
    }

    handleClose();

    addDoc(collection(db, "boards"), {
      boardTitle: title,
      boardDescription: description,
      uid: user.uid,
      boardID: uuidv4(),
    });

    setTitle("");
    setDescription("");

    fetchBoards();
  }

  // deletes a board from the database
  async function deleteFromDB(bid) {
    try {
      getDocs(collection(db, "boards")).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.data().boardID === bid) {
            deleteDoc(doc.ref).then(() => {
              console.log("Document successfully deleted!");
            });
          }
        });
      });

      await new Promise(r => setTimeout(r, 200));
      fetchBoards();
    } catch (err) {
      console.log(err);
    }
  }

  // checks if the user is logged in
  // if not, redirect to login page
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchBoards();
  }, [user, loading]);

  // fetchBoards when boardsToShow length changes
  useEffect(() => {
    fetchBoards();
  }, [boardsToShow.length]);

  return (
    <>
      <div className="header">
        <div className="header__left">
          <h1>Direct</h1>
        </div>
        <div className="header__right">
          <div className="logged-in-as">Logged in as {user?.email}</div>
          <button data-testid="logout-button" onClick={logout}>Logout</button>
        </div>
      </div>

      <div classname="dashboard--header">
        <div className="dashboard--header__left">
          <h2>Current Boards</h2>
        </div>
        <div className="dashboard--header__right">
          <Button data-testid="create-board" variant="primary" onClick={handleShow}>
            Create A Board
          </Button>
        </div>
      </div>

      {boardsToShow.length === 0 ? (
        <div className="no-boards">
          <h2>You haven't made a board yet. Go make one!</h2>
        </div>
      ) : (
        <div className="row">
          {boardsToShow &&
            boardsToShow.map((board, index) => (
              <div className="boards col-lg-2 col-md-4 col-sm-6 col-xs-12">
                <Board
                  key={index}
                  title={board.boardTitle}
                  description={board.boardDescription}
                  boardID={board.boardID}
                  deleteFromDB={deleteFromDB}
                />
              </div>
            ))}
        </div>
      )}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Board</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Board Title"
                autoFocus
                value={title}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    addBoardToDB();
                  }
                }}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Form.Control.Feedback>
                Please enter a title.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Board Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={addBoardToDB}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default Dashboard;
