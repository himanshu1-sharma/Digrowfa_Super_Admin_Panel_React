import React from 'react'
import Modal from 'react-bootstrap/Modal';

const DeleteModal = (props) => {
    return (
        <>
            <Modal
                {...props}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >

                <Modal.Body>
                    <div className='addCategoryModal'>
                        <div className='conformationModalContent'>
                            <p>Are you sure you <br />want to delete</p>
                            <button onClick={props.onHide}>No</button>
                            <button onClick={() => props.myFunction()}>Yes</button>
                        </div>

                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default DeleteModal

