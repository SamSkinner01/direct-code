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
import {useParams} from "react-router-dom";
import Note from "../components/Note";

function BoardPage(props) {
  const {id} = useParams();
  const boardID = id;
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [description, setDescription] = useState("");
  const [show, setShow] = useState(false);
  const [notesToShow, setNotesToShow] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const fetchBoardTitleAndDescription = async () => {
    try{
      const boardsRef = collection(db, 'boards');
      const q = query(boardsRef, where('boardID', '==', id));
      const docs = await getDocs(q);
      const boards = docs.docs.map(item => item.data());
      console.log(boards);
      setTitle(boards[0].boardTitle);
      setDescription(boards[0].boardDescription);
    }
    catch(err){
      console.log(err);
    }
  }

  const fetchNotes = async () => { 
    
    try{
      const boardsRef = collection(db, 'notes');
      const q = query(boardsRef, where('boardID', '==', id));
      const docs = await getDocs(q);
      const notes = docs.docs.map(item => item.data());
      if(notes.length !== notesToShow.length){
        setNotesToShow(notes);
      }
    }
    catch(err){
      console.log(err);
    }

  }

function addNoteToDB() {
    handleClose();

    addDoc(collection(db, "notes"), {
      noteTitle: noteTitle,
      boardID: id,
      noteID: uuidv4(),
    });  

    fetchNotes();
  }

  async function deleteFromDB(nid) {
    try{
      getDocs(collection(db, "notes")).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if(doc.data().noteID === nid){
            deleteDoc(doc.ref);
          }
        });
      });
      fetchNotes();
    }
    catch(err){
      console.log(err);
    }
  }
  


  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
  }, [user, loading]);


  fetchBoardTitleAndDescription();
  fetchNotes();
  return (
    <>

    <h1>{title}</h1>
    <h2>{description}</h2>
    <button onClick={logout}>
          Logout
    </button>
    <div>Logged in as {user?.email}</div>       
    
    <div className="notes">
      {notesToShow && notesToShow.map((note,index) => (
        <Note key={index} title={note.noteTitle} noteID={note.noteID} deleteFromDB={deleteFromDB}/>
        
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
              <Form.Label>Note Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Note Title"
                autoFocus
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={addNoteToDB}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    
    </>
  );
}
export default BoardPage;
