import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import {
    getFirestore, query, getDocs, collection, where, addDoc, map, doc, deleteDoc, updateDoc} from "firebase/firestore";
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import Item from './Item';
import ItemForm from './ItemForm';
import {db} from '../Firebase';
import {v4 as uuidv4} from 'uuid';

function Note(props) {

    const [modalShow, setModalShow] = useState(false);
    const [items, setItems] = useState([]);

    const fetchItems = async () => { 
    
        try{
          const boardsRef = collection(db, 'items');
          const q = query(boardsRef, where('noteID', '==', props.noteID));
          const docs = await getDocs(q);
          const item = docs.docs.map(item => item.data());
          if(item.length !== items.length){
            setItems(item);
          }
        }
        catch(err){
          console.log(err);
        }
    
      }

    const addItem = text => {
        const itemID = uuidv4();
        const newItems = [...items, { text }, {isCompleted: false}, {itemID: itemID}];
        setItems(newItems);

        addDoc(collection(db, "items"), {
            itemTitle: text,
            isCompleted: false,
            noteID: props.noteID,
            itemID: itemID
          });
      };

      const completeItem = (index, itemID) => {
        const newItems = [...items];
        newItems[index].isCompleted = true;
        setItems(newItems);

        //get reference to the item in the database
        try{
            getDocs(collection(db, "items")).then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                if(doc.data().itemID === itemID){
                    
                  updateDoc(doc.ref, {
                    isCompleted: true,
                  });
                }
              });
            });
          }
          catch(err){
            console.log(err);
          }
      };

      const removeItem = (index,itemID) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);

        try{
            getDocs(collection(db, "items")).then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                if(doc.data().itemID === itemID){
                  deleteDoc(doc.ref);
                }
              });
            });
            fetchItems();
        }
          catch(err){
            console.log(err);
      };
    }
      
    function deleteFN() {
        props.deleteFromDB(props.noteID);
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

    fetchItems();
    return (

        <Card style={{ width: '18rem' }}>
            <Card.Body>
                <Card.Title>{props.title}</Card.Title>
                <div >
                    <div >
                        {items.map((item, index) => (
                            <Item
                                key={index}
                                index={index}
                                item={item}
                                itemID={item.itemID}
                                completeItem={completeItem}
                                removeItem={removeItem}
                            />
                        ))}

                        <ItemForm addItem={addItem}/>
                    </div>
                </div>
            </Card.Body>



            <Button variant="danger" onClick={onShow}>Delete Note</Button>

            <Modal
                show={modalShow}
                onHide={onHide}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Delete A Note
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Selecting confirm will delete the note. This action cannot be undone.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={onHideConfirm}>Confirm</Button>
                </Modal.Footer>
            </Modal>

        </Card>
    );
}

export default Note;