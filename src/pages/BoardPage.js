import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "../css/dashboard.css";
import { auth, db } from "../Firebase";
import { logout } from "../userAuth";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {
  query,
  getDocs,
  collection,
  where,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router-dom";
import Note from "../components/Note";

function BoardPage(props) {
  const { id } = useParams();
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [description, setDescription] = useState("");
  const [show, setShow] = useState(false);
  const [notesToShow, setNotesToShow] = useState([]);

  const handleClose = () => {
    setShow(false);
    setNoteTitle("");
  };
  const handleShow = () => setShow(true);

  const fetchBoardTitleAndDescription = async () => {
    try {
      const boardsRef = collection(db, "boards");
      const q = query(boardsRef, where("boardID", "==", id));
      const docs = await getDocs(q);
      const boards = docs.docs.map((item) => item.data());
      setTitle(boards[0].boardTitle);
      setDescription(boards[0].boardDescription);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchNotes = async () => {
    try {
      const boardsRef = collection(db, "notes");
      const q = query(boardsRef, where("boardID", "==", id));
      const docs = await getDocs(q);
      const notes = docs.docs.map((item) => item.data());
      if (notes.length !== notesToShow.length) {
        setNotesToShow(notes);
      }
    } catch (err) {
      console.log(err);
    }
  };

  function addNoteToDB() {
    if (noteTitle === "") {
      alert("Please fill out all fields");
      return;
    }

    handleClose();

    addDoc(collection(db, "notes"), {
      noteTitle: noteTitle,
      boardID: id,
      noteID: uuidv4(),
    });

    setNoteTitle("");

    fetchNotes();
  }

  async function deleteFromDB(nid) {
    try {
      getDocs(collection(db, "notes")).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.data().noteID === nid) {
            deleteDoc(doc.ref);
          }
        });
      });
      fetchNotes();
    } catch (err) {
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
      <div className="header">
        <div className="header__left">
          <h1>Direct</h1>
        </div>
        <div className="header__right">
          <div className="logged-in-as">Logged in as {user?.email}</div>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      <div classname="dashboard--header">
        <div className="dashboard--header__left">
          <h2>You are on the board titled: {title}</h2>
          <h4>Board Description: {description}</h4>
        </div>
        <div className="dashboard--header__right">
          <Button variant="primary" onClick={handleShow}>
            Create a Note
          </Button>
        </div>
      </div>

      {notesToShow.length === 0 ? (
        <div className="no-boards">
          <h2>You currently have not created a note. Go make one!</h2>
        </div>
      ) : (
        <div className="row">
          {notesToShow &&
            notesToShow.map((note, index) => (
              <div className="boards col-lg-2 col-md-4 col-sm-6 col-xs-12">
                <Note
                  key={index}
                  title={note.noteTitle}
                  noteID={note.noteID}
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
              <Form.Label>Note Title</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Note Title"
                autoFocus
                value={noteTitle}
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    addNoteToDB();
                  }
                }}
                onChange={(e) => setNoteTitle(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" onClick={addNoteToDB}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default BoardPage;
