import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "../css/dashboard.css";
import { auth, db } from "../Firebase";
import { logout } from "../userAuth";
import Board from "../components/Board";
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import {
  getFirestore, query, getDocs, collection, where, addDoc, map} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function Dashboard() {
  //const currentUser = getAuth(auth);

  const [user, loading, error] = useAuthState(auth);
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [boardsToShow, setBoardsToShow] = useState([]);
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const fetchBoards = async () => { 

    console.log("Fetching boards");
    
    try{
      const userID = user?.uid || "";
      const boardsRef = collection(db, 'boards');
      const q = query(boardsRef, where('uid', '==', userID));
      const docs = await getDocs(q);
      const boards = docs.docs.map(item => item.data());
      setBoardsToShow(boards);
    }
    catch(err){
      console.log(err);
    }

  }

  function addBoardToDB() {
    handleClose();

    addDoc(collection(db, "boards"), {
      boardTitle: title,
      boardDescription: description,
      uid: user.uid
    });  

    fetchBoards();
  }


  // useEffect(() => {
  //   if (loading) return;
  //   if (!user) return navigate("/");
  // }, [user, loading]);

  // useEffect(() => {
  //   fetchBoards();
  // }, [boardsToShow]);
  fetchBoards();
  return (
    <>

    <h1>Current Boards</h1>
    <button onClick={logout}>
          Logout
    </button>
    <div>Logged in as {user?.email}</div>       
    
    
    <div className="boards">
      {boardsToShow && boardsToShow.map((board,index) => (
        <Board key={index} title={board.boardTitle} description={board.boardDescription} />
      ))}
    </div>

    <Button variant="primary" onClick={handleShow}>
        +
      </Button>
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Board</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Board Title"
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="description"
            >
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
