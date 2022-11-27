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
  getFirestore, query, getDocs, collection, where, addDoc, map, doc, deleteDoc} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {v4 as uuidv4} from 'uuid';

function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [boardsToShow, setBoardsToShow] = useState([]);
  const navigate = useNavigate();

  const handleClose = () => {
    setShow(false)
    setTitle("");
    setDescription("");  
  };
  const handleShow = () => setShow(true);

  const fetchBoards = async () => { 
    
    try{
      const userID = user?.uid || "";
      const boardsRef = collection(db, 'boards');
      const q = query(boardsRef, where('uid', '==', userID));
      const docs = await getDocs(q);
      const boards = docs.docs.map(item => item.data());
      if(boards.length !== boardsToShow.length){
        setBoardsToShow(boards);
      }
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
      uid: user.uid,
      boardID: uuidv4(),
    });  

    setTitle("");
    setDescription("");

    fetchBoards();
  }

  async function deleteFromDB(bid) {
    try{
      getDocs(collection(db, "boards")).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if(doc.data().boardID === bid){
            deleteDoc(doc.ref);
          }
        });
      });
      fetchBoards();
    }
    catch(err){
      console.log(err);
    }
  }
  

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
  }, [user, loading]);

  fetchBoards();

  return (
    <>

    <h1>Current Boards</h1>
    <button onClick={logout}>
          Logout
    </button>
    <div>Logged in as {user?.email}</div>       
    
   
    {boardsToShow.length === 0 ? <div className="no-boards"><h2>You haven't made a board yet. Go make one!</h2></div> :
     <div className="boards">
     {boardsToShow && boardsToShow.map((board,index) => (
       <Board key={index} title={board.boardTitle} description={board.boardDescription} boardID={board.boardID} deleteFromDB={deleteFromDB}/>
     ))}
   </div>
    }
    
   

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
                required
                type="text"
                placeholder="Board Title"
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Form.Control.Feedback>Please enter a title.</Form.Control.Feedback>
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
