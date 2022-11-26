import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";

import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import Item from './Item';
import ItemForm from './ItemForm';

function Note(props) {

    const [modalShow, setModalShow] = useState(false);
    const [items, setItems] = useState([
        { text: "Learn about React", isCompleted: false },
        { text: "Meet friend for lunch", isCompleted: false },
        { text: "Build really cool Item app", isCompleted: false }
    ]);

    const addItem = text => {
        const newItems = [...items, { text }];
        setItems(newItems);
      };

      const completeItem = index => {
        const newItems = [...items];
        newItems[index].isCompleted = true;
        setItems(newItems);
      };
      
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
                                item={item.text}
                                completeItem={completeItem}
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