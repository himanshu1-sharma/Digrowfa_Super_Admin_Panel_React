import React, { useState, useEffect } from 'react'
import Header from '../Includes/Header/Header'
import LeftPanel from '../Includes/LeftPanel/LeftPanel'
import RPtable from './DataTable/RPtable'
import { UserState } from '../Context'
import { useNavigate } from 'react-router-dom'
import editProfile from "../../img/icons/editProfile.webp";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Dashboard.css'
import Accordion from 'react-bootstrap/Accordion';
import addIcon from "../../img/icons/addIconWhite.png"
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose } from '@fortawesome/free-solid-svg-icons'
import Axios from 'axios';
import { BASEURL } from '../Constant';
import Form from 'react-bootstrap/Form';

const AddUser = () => {

    const { user, setUser } = UserState()
    const navigate = useNavigate()
    const [addUserModal, setAddUserModal] = React.useState(false);

    useEffect(() => {
        if (!(user && (user.role === 'all' || user.role === 'user'))) {
            navigate("/login")
        }
    }, [user])

    return (
        <>
            <ToastContainer />
            <AddUserModal
                show={addUserModal}
                onHide={() => setAddUserModal(false)}
            />
            <Header />
            <div className='container'>
                <div className='row'>
                    <div className='col-xl-2 col-lg-12 col-md-12 col-sm-12 col-12'>
                        <div className='mobileHide'>
                            <LeftPanel />
                        </div>
                    </div>
                    <div className='col-xl-10 col-lg-12 col-md-12 col-sm-12 col-12'>
                        <div className='dashboardMainBox'>
                            <div className='title'>
                                <h4>Add User</h4>
                            </div>
                            <div className='dashboardAccordion'>
                                <Accordion>
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header>User</Accordion.Header>
                                        <Accordion.Body>
                                            <div className='categoryBtnList'>
                                                <ul>
                                                    <li>
                                                        <button className='dashboardAddBtn' onClick={() => setAddUserModal(true)}><img src={addIcon} alt="addIcon" className='img-fluid' /> Add User</button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddUser

// ========add user=========
function AddUserModal(props) {
    const [chooseCategory, setChooseCategory] = useState()
    const [image, setImage] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [title, setTitle] = useState("")
    const [username, setUsername] = useState("")
    const [categoryId, setCategoryId] = useState([])


    const fetchCategory = async () => {
        await Axios.get(`${BASEURL}api/category`)
            .then(data => {
                setChooseCategory(data.data.data)
            })

    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {


            console.log("profilepic", image);

            await Axios.post(`${BASEURL}api/crm/admin/create-user`, { name: name, title: title, categoryid: categoryId, email: email, profilepic: image, password: password, username: username })
                .then(data => {
                    if (data.data.errorcode === 0) {
                        toast.success(`${data.data.msg}`, {
                            position: "bottom-center",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "dark",
                        });
                        props.onHide()

                    }
                    else {
                        toast.error(`${data.data.msg}`, {
                            position: "bottom-center",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "dark",
                        });
                    }
                })
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        fetchCategory()
    }, [])
    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body>
                <div className='addCategoryModal'>
                    <div className='closeModalBtn' onClick={props.onHide}>
                        <FontAwesomeIcon icon={faClose} />
                    </div>
                    <h4>Add User</h4>
                    <form>
                        <div className='formInput'>
                            <input type="text" name="image" id="image" placeholder='Add Profile URL' value={image} onChange={(e) => setImage(e.target.value)} />
                        </div>
                        <div className='formInput'>
                            <input type="text" name="name" id="name" placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className='formInput'>
                            <input type="text" name="username" id="username" placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className='formInput'>
                            <input type="text" name="title" id="title" placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} />
                        </div>
                        <div className='formInput'>
                            <input type="email" name="email" id="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className='formInput'>
                            <input type="password" name="password" id="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className='formInput'>
                            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                                <option selected>Choose Category</option>
                                {chooseCategory && chooseCategory.map(curElt => {
                                    return (
                                        <>
                                            <option value={curElt._id}>{curElt.name}</option>
                                        </>
                                    )
                                })}

                            </select>
                        </div>
                        <div className='formBtn'>
                            <button onClick={handleSubmit}>Done</button>
                        </div>
                    </form>
                </div>
            </Modal.Body>
        </Modal>
    );
}