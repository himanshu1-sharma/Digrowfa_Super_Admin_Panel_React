import React, { useState, useEffect } from "react";
import Header from "../Includes/Header/Header";
import LeftPanel from "../Includes/LeftPanel/LeftPanel";
import "./Dashboard.css";
import Accordion from "react-bootstrap/Accordion";
import addIcon from "../../img/icons/addIconWhite.png";
import Modal from "react-bootstrap/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faTrash } from "@fortawesome/free-solid-svg-icons";
import Axios from "axios";
import { BASEURL, APP_BASEURL } from "../Constant";
import Form from "react-bootstrap/Form";
import UserReportingReasone from "./DataTable/UserReportingReason";
import ProblemReportingReasone from "./DataTable/ProblemReportingReason";
import ProductReportingReasion from "./DataTable/ProductReportingReason";
import ServiceReportingReasion from "./DataTable/ServiceReportingReason";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { UserState } from "../Context";
import { useNavigate } from "react-router-dom";

const AddEdit = () => {
    const { user } = UserState();
    const navigate = useNavigate();

    const [superCategoryModal, setSuperCategoryModal] = React.useState(false);
    const [superCategory, setSuperCategory] = useState("");
    const [superCategoryType, setSuperCategoryType] = useState("");
    const [shoutCategory, setShoutCategory] = React.useState(false);
    const [shoutTopic, setShoutTopic] = React.useState(false);

    // const [categoryModal, setCategoryModal] = React.useState(false);
    // const [getCategory, setGetCategory] = useState()
    // const [categoryValue, setCategoryValue] = useState("")
    // const [categoryTitle, setCategoryTitle] = useState("")
    // const [categoryType, setCategoryType] = useState("")
    // const [subCategoryModal, setSubCategoryModal] = React.useState(false);
    // const [addUserModal, setAddUserModal] = React.useState(false);

    useEffect(() => {
        if (!(user && user.role === "all")) {
            navigate("/login");
        }
    }, [user]);

    // const handleType = async (x) => {
    //     setCategoryType(x)
    //     try {
    //         let data
    //         if (x == "All") {
    //             data = await Axios.get(`${BASEURL}api/category`)
    //         }
    //         else if (x == "service") {
    //             data = await Axios.get(`${BASEURL}api/category/service`)
    //         }
    //         else if (x == "product") {
    //             data = await Axios.get(`${BASEURL}api/category/product`)
    //         }
    //         else console.log("No Value Selected")
    //         setGetCategory(data.data.data)
    //     } catch (error) {
    //         console.log(error.message)
    //     }
    // }

    const handleSuperCategorySubmit = (e) => {
        e.preventDefault();

        Axios.post(`${BASEURL}api/category`, {
            name: superCategory,
            superParent: "",
            parent: "",
            type: superCategoryType,
        }).then((data) => {
            setSuperCategoryModal(false);
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
            } else {
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
        });
    };

    // const handleCategorySubmit = (e) => {
    //     e.preventDefault()

    //     Axios.post(`${BASEURL}api/category`, { name: categoryTitle, superParent: categoryValue, parent: '', type: categoryType })
    //         .then(data => {
    //             setCategoryModal(false)
    //         })
    // }

    return (
        <>
            <ToastContainer />
            <SuperCategoryModal
                show={superCategoryModal}
                onHide={() => setSuperCategoryModal(false)}
                setSuperCategory={setSuperCategory}
                superCategory={superCategory}
                handleSuperCategorySubmit={handleSuperCategorySubmit}
                setSuperCategoryType={setSuperCategoryType}
                superCategoryType={superCategoryType}
            />
            <ShoutCategoryModal
                show={shoutCategory}
                onHide={() => setShoutCategory(false)}
            />
            <ShoutTopicModal
                show={shoutTopic}
                onHide={() => setShoutTopic(false)}
            />
            {/* <CategoryModal
                show={categoryModal}
                onHide={() => setCategoryModal(false)}
                getCategory={getCategory}
                setCategoryValue={setCategoryValue}
                categoryValue={categoryValue}
                handleType={handleType}
                setCategoryTitle={setCategoryTitle}
                categoryTitle={categoryTitle}
                handleCategorySubmit={handleCategorySubmit}
            />
            <SubCategoryModal
                show={subCategoryModal}
                onHide={() => setSubCategoryModal(false)}
                handleType={handleType}
                setCategoryValue={setCategoryValue}
                categoryValue={categoryValue}
                getCategory={getCategory}
                categoryType={categoryType}
            /> */}

            <Header />
            <div className="container">
                <div className="row">
                    <div className="col-xl-2 col-lg-12 col-md-12 col-sm-12 col-12">
                        <div className="mobileHide">
                            <LeftPanel />
                        </div>
                    </div>
                    <div className="col-xl-10 col-lg-12 col-md-12 col-sm-12 col-12">
                        <div className="dashboardMainBox">
                            <div className="title">
                                <h4>Add/Edit</h4>
                            </div>
                            <div className="dashboardAccordion">
                                <Accordion>
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header>Category</Accordion.Header>
                                        <Accordion.Body>
                                            <div className="categoryBtnList">
                                                <ul>
                                                    <li>
                                                        <button
                                                            className="dashboardAddBtn"
                                                            onClick={() => setSuperCategoryModal(true)}
                                                        >
                                                            <img
                                                                src={addIcon}
                                                                alt="addIcon"
                                                                className="img-fluid"
                                                            />{" "}
                                                            Add Super Category
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button
                                                            className="dashboardAddBtn"
                                                            onClick={() => setShoutCategory(true)}
                                                        >
                                                            <img
                                                                src={addIcon}
                                                                alt="addIcon"
                                                                className="img-fluid"
                                                            />{" "}
                                                            Add Shout Category
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button
                                                            className="dashboardAddBtn"
                                                            onClick={() => setShoutTopic(true)}
                                                        >
                                                            <img
                                                                src={addIcon}
                                                                alt="addIcon"
                                                                className="img-fluid"
                                                            />{" "}
                                                            Add Shout Topic
                                                        </button>
                                                    </li>
                                                    {/* <li>
                                                        <button className='dashboardAddBtn' onClick={() => setCategoryModal(true)}><img src={addIcon} alt="addIcon" className='img-fluid' /> Add Category</button>
                                                    </li>
                                                    <li>
                                                        <button className='dashboardAddBtn' onClick={() => setSubCategoryModal(true)}><img src={addIcon} alt="addIcon" className='img-fluid' /> Add Sub Category</button>
                                                    </li> */}
                                                </ul>
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="1">
                                        <Accordion.Header>User Reporting Reason</Accordion.Header>
                                        <Accordion.Body>
                                            <div className="dataTable">
                                                <UserReportingReasone />
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="2">
                                        <Accordion.Header>
                                            Problem Reporting Reason
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <div className="dataTable">
                                                <ProblemReportingReasone />
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="3">
                                        <Accordion.Header>
                                            Product Reporting Reason
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <div className="dataTable">
                                                <ProductReportingReasion />
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="4">
                                        <Accordion.Header>
                                            Service Reporting Reason
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <div className="dataTable">
                                                <ServiceReportingReasion />
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>

                                    <Accordion.Item eventKey="5">
                                        <Accordion.Header>verification form</Accordion.Header>
                                        <Accordion.Body>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                                            sed do eiusmod tempor incididunt ut labore et dolore magna
                                            aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                                            ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                            Duis aute irure dolor in reprehenderit in voluptate velit
                                            esse cillum dolore eu fugiat nulla pariatur. Excepteur
                                            sint occaecat cupidatat non proident, sunt in culpa qui
                                            officia deserunt mollit anim id est laborum.
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddEdit;

// ============add super category modal==============

function SuperCategoryModal(props) {
    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body>
                <div className="addCategoryModal">
                    <div className="closeModalBtn" onClick={props.onHide}>
                        <FontAwesomeIcon icon={faClose} />
                    </div>
                    <h4>Add Super Category</h4>
                    <form onSubmit={props.handleSuperCategorySubmit}>
                        <div className="formInput">
                            <input
                                type="text"
                                name="superCategoryName"
                                id="superCategoryName"
                                placeholder="Title"
                                onChange={(e) => props.setSuperCategory(e.target.value)}
                                value={props.superCategory}
                            />
                        </div>
                        <div className="formRadioGroup">
                            {["radio"].map((type) => (
                                <div key={`inline-${type}`} className="mb-3">
                                    <Form.Check
                                        onChange={(e) => props.setSuperCategoryType(e.target.value)}
                                        inline
                                        label="Profile"
                                        name="group1"
                                        type={type}
                                        id={`inline-${type}-1`}
                                        value="All"
                                    />
                                    <Form.Check
                                        onChange={(e) => props.setSuperCategoryType(e.target.value)}
                                        inline
                                        label="Product"
                                        name="group1"
                                        type={type}
                                        id={`inline-${type}-2`}
                                        value="product"
                                    />

                                    <Form.Check
                                        onChange={(e) => props.setSuperCategoryType(e.target.value)}
                                        inline
                                        label="Service"
                                        name="group1"
                                        type={type}
                                        id={`inline-${type}-3`}
                                        value="service"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="formBtn">
                            <button>Done</button>
                        </div>
                    </form>
                </div>
            </Modal.Body>
        </Modal>
    );
}

// ===========end==================

// ============category modal=============

// function CategoryModal(props) {

//     // console.log("get category", props.categoryValue)

//     return (
//         <Modal
//             {...props}
//             size="md"
//             aria-labelledby="contained-modal-title-vcenter"
//             centered
//         >
//             <Modal.Body>
//                 <div className='addCategoryModal'>
//                     <div className='closeModalBtn' onClick={props.onHide}>
//                         <FontAwesomeIcon icon={faClose} />
//                     </div>
//                     <h4>Add Category</h4>
//                     <form onSubmit={props.handleCategorySubmit}>
//                         <div className='formRadioGroup'>
//                             {['radio'].map((type) => (
//                                 <div key={`inline-${type}`} className="mb-3">
//                                     <Form.Check
//                                         inline
//                                         label="Profile"
//                                         name="group1"
//                                         type={type}
//                                         id={`inline-${type}-1`}
//                                         value="All"
//                                         onChange={(e) => props.handleType(e.target.value)}
//                                     // checked={props.categoryValue?.type == "All" ? true : false}
//                                     />
//                                     <Form.Check
//                                         inline
//                                         label="Product"
//                                         name="group1"
//                                         type={type}
//                                         id={`inline-${type}-2`}
//                                         value="product"
//                                         onChange={(e) => props.handleType(e.target.value)}
//                                     // checked={props.categoryValue?.type == "product" ? true : false}
//                                     />

//                                     <Form.Check
//                                         inline
//                                         label="Service"
//                                         name="group1"
//                                         type={type}
//                                         id={`inline-${type}-3`}
//                                         value="service"
//                                         onChange={(e) => props.handleType(e.target.value)}
//                                     // checked={props.categoryValue?.type == "service" ? true : false}
//                                     />
//                                 </div>
//                             ))}
//                         </div>
//                         <div className='formInput'>

//                             <select onChange={(e) => { props.setCategoryValue(e.target.value) }}>
//                                 <option selected>Choose Super Category</option>
//                                 {props.getCategory && props.getCategory?.map((curCategory) => {

//                                     return (
//                                         <>
//                                             <option value={curCategory?._id}>{curCategory?.name}</option>
//                                         </>
//                                     )
//                                 })}

//                             </select>
//                         </div>
//                         <div className='formInput'>
//                             <input type="text" name="superCategoryName" id="superCategoryName" placeholder='Title' onChange={(e) => props.setCategoryTitle(e.target.value)} value={props.categoryTitle} />
//                         </div>

//                         <div className='formBtn'>
//                             <button>Done</button>
//                         </div>
//                     </form>
//                 </div>
//             </Modal.Body>
//         </Modal>
//     );
// }

// =========end============

// ===============sub category modal==============

// function SubCategoryModal(props) {

//     const [chooseCategory, setChooseCategory] = useState()
//     const [getSelectName, setGetSelectName] = useState()
//     const [subCategoryTitle, setSubCategoryTitle] = useState('')
//     const [choosedCategoryId, setChooseCategoryId] = useState()

//     // console.log("getSelectName", getSelectName)

//     const handleCategoryValue = async (y) => {
//         // console.log("yyyyyyyyyyyyyy", y)
//         setChooseCategoryId(y)
//         try {
//             let { data } = await Axios.post(`${BASEURL}api/category/categories`, { superCategoryId: y })
//             setChooseCategory(data.data)
//         } catch (error) {
//             console.log(error.message)
//         }
//     }

//     const handleSubCategoryForm = (e) => {
//         e.preventDefault()

//         Axios.post(`${BASEURL}api/category`, { name: subCategoryTitle, superParent: choosedCategoryId, parent: getSelectName, type: props.categoryType })
//             .then(data => {
//                 // console.log("form data", data)
//                 props.onHide()
//             })
//     }

//     return (
//         <Modal
//             {...props}
//             size="md"
//             aria-labelledby="contained-modal-title-vcenter"
//             centered
//         >
//             <Modal.Body>
//                 <div className='addCategoryModal'>
//                     <div className='closeModalBtn' onClick={props.onHide}>
//                         <FontAwesomeIcon icon={faClose} />
//                     </div>
//                     <h4>Add Category</h4>
//                     <form onSubmit={handleSubCategoryForm}>
//                         <div className='formRadioGroup'>
//                             {['radio'].map((type) => (
//                                 <div key={`inline-${type}`} className="mb-3">
//                                     <Form.Check
//                                         inline
//                                         label="Profile"
//                                         name="group1"
//                                         type={type}
//                                         id={`inline-${type}-1`}
//                                         value="All"
//                                         onChange={(e) => props.handleType(e.target.value)}
//                                     // checked={props.categoryValue?.type == "All" ? true : false}
//                                     />
//                                     <Form.Check
//                                         inline
//                                         label="Product"
//                                         name="group1"
//                                         type={type}
//                                         id={`inline-${type}-2`}
//                                         value="product"
//                                         onChange={(e) => props.handleType(e.target.value)}
//                                     // checked={props.categoryValue?.type == "product" ? true : false}
//                                     />

//                                     <Form.Check
//                                         inline
//                                         label="Service"
//                                         name="group1"
//                                         type={type}
//                                         id={`inline-${type}-3`}
//                                         value="service"
//                                         onChange={(e) => props.handleType(e.target.value)}
//                                     // checked={props.categoryValue?.type == "service" ? true : false}
//                                     />
//                                 </div>
//                             ))}
//                         </div>
//                         <div className='formInput'>

//                             <select onChange={(e) => handleCategoryValue(e.target.value)}>
//                                 <option selected>Choose Super Category</option>
//                                 {props.getCategory && props.getCategory?.map((curCategory) => {

//                                     return (
//                                         <>
//                                             <option value={curCategory?._id}>{curCategory?.name}</option>
//                                         </>
//                                     )
//                                 })}

//                             </select>
//                         </div>
//                         <div className='formInput'>
//                             <select onChange={(e) => setGetSelectName(e.target.value)}>
//                                 <option selected>Choose Category</option>
//                                 {chooseCategory && chooseCategory?.map((curElt) => {
//                                     return (
//                                         <>
//                                             <option value={curElt?._id}>{curElt?.name}</option>
//                                         </>
//                                     )
//                                 })}
//                             </select>
//                         </div>
//                         <div className='formInput'>
//                             <input type="text" name="superCategoryName" id="superCategoryName" placeholder='Title' onChange={(e) => setSubCategoryTitle(e.target.value)} value={subCategoryTitle} />
//                         </div>

//                         <div className='formBtn'>
//                             <button>Done</button>
//                         </div>
//                     </form>
//                 </div>
//             </Modal.Body>
//         </Modal>
//     );
// }

function ShoutCategoryModal(props) {

    const [image, setImage] = useState("")
    const [category, setCategory] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const formData = new FormData();
            formData.append("name", category);
            formData.append("image", image);

            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            };

            await Axios.post(`${BASEURL}api/crm/add-category`, formData, config)
                .then((data) => {
                    if (data.data.errorcode === 0) {
                        toast.success(`${data.data.msg}`, {
                            position: "bottom-center",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                        });
                        props.onHide();
                        setCategory("")
                    } else {
                        toast.error(`${data.data.msg}`, {
                            position: "bottom-center",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                        });
                    }
                });
        } catch (error) {
            console.log(error)
        }
    }

    const uploadImage = (e) => {
        const file = e.target.files[0];
        setImage(file)
    }

    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body>
                <div className="addCategoryModal">
                    <div className="closeModalBtn" onClick={props.onHide}>
                        <FontAwesomeIcon icon={faClose} />
                    </div>
                    <h4>Add Shout Category</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="formInput">
                            <input
                                type="file"
                                name="image1"
                                id="image1"
                                placeholder="image1"
                                onChange={(e) => uploadImage(e)}
                            />
                        </div>
                        <div className="formInput">
                            <input
                                type="text"
                                name="shoutCategoryName"
                                id="shoutCategoryName"
                                placeholder="Category Name"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            />
                        </div>
                        <div className="formBtn">
                            <button>Done</button>
                        </div>
                    </form>
                </div>
            </Modal.Body>
        </Modal>
    );
}


function ShoutTopicModal(props) {

    const [categoryName, setCategoryName] = useState()
    const [category, setCategory] = useState("")
    const [topic, setTopic] = useState("")
    const [topicData, setTopicData] = useState("")

    const fetchCategory = async () => {
        try {
            await Axios.get(`${BASEURL}api/crm/get-categories`)
                .then(data => {
                    setCategoryName(data.data.data)
                })
        } catch (error) {
            console.log(error)
        }
    }

    const handleTopic = () => {
        setTopic([...topic, topicData])
        setTopicData("")
    }

    const handleRemoveTopic = (index) => {
        const newTopic = [...topic];
        newTopic.splice(index, 1);
        setTopic(newTopic);
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        await Axios.post(`${BASEURL}api/crm/add-topic-to-category`, { categoryId: category, topic: topic })
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
                        theme: "light",
                    });
                    props.onHide();
                    setCategory("")
                    setTopic([])
                } else {
                    toast.error(`${data.data.msg}`, {
                        position: "bottom-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                }
            })
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
                <div className="addCategoryModal">
                    <div className="closeModalBtn" onClick={props.onHide}>
                        <FontAwesomeIcon icon={faClose} />
                    </div>
                    <h4>Add Shout Topic</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="formInput">
                            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option selected>Choose Category</option>
                                {categoryName?.map(curElt => {
                                    return (
                                        <>
                                            <option value={curElt?._id}>{curElt?.name}</option>
                                        </>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="formInput">
                            <div className="d-flex">
                                <input
                                    type="text"
                                    name="topic"
                                    id="topic"
                                    placeholder="Topic"
                                    value={topicData}
                                    onChange={(e) => setTopicData(e.target.value)}
                                />
                                <div className="formBtn">
                                    <button type="button" onClick={handleTopic}>Add</button>
                                </div>
                            </div>
                        </div>
                        {topic &&
                            topic.map((curStep, index) => {
                                return (
                                    <>
                                        <li>
                                            {index + 1} = {curStep}
                                            <a style={{ color: "red", marginLeft: "10px" }} type="button" onClick={(index) => handleRemoveTopic(index)}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </a>
                                        </li>
                                    </>
                                );
                            })}
                        <div className="formBtn">
                            <button>Done</button>
                        </div>
                    </form>
                </div>
            </Modal.Body>
        </Modal>
    );
}
