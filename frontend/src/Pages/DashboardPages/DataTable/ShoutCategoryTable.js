import React, { forwardRef, useEffect, useState } from "react";
import Axios from "axios";
import MaterialTable from "material-table";
import {
    AddBox,
    ArrowDownward,
    Check,
    ChevronLeft,
    ChevronRight,
    Clear,
    DeleteOutline,
    Edit,
    FilterList,
    FirstPage,
    LastPage,
    Remove,
    SaveAlt,
    Search,
    ViewColumn,
} from "@material-ui/icons";

import { APP_BASEURL, BASEURL } from "../../Constant";
import Modal from "react-bootstrap/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faTrash } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import Form from "react-bootstrap/Form";
import papaparse from "papaparse";
import { UserState } from '../../Context'
import DeleteModal from "../../Components/DeleteModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';


const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const UserList = () => {
    const [selectedData, setSelectedData] = useState("");
    const [selectedProductData, setSelectedProductData] = useState("");
    const [data, setData] = useState([]);
    const [modalShow, setModalShow] = React.useState(false);
    const [productModalShow, setProductModalShow] = React.useState(false);
    const [render, setRender] = useState(false)
    const [deleteModalShow, setDeleteModalShow] = React.useState(false);
    const [selected, setSelected] = useState();
    const { user, setUser } = UserState();
    // console.log(data);

    useEffect(() => {
        if (render) setRender(false)
        getData();
    }, [render]);

    const getData = async () => {
        const userData = await Axios.get(`${BASEURL}api/crm/get-categories`);
        console.log("api/report/report-product", userData.data.data);
        setData(userData.data.data);
    };

    const columns = [
        { title: "ID", field: "_id" },
        {
            title: "IMAGE", field: "reportedUserData", render: (rowData) => <>
                <img src={rowData?.image?.location} alt="" className="img-fluid productPreviewImg" onClick={() => { setSelectedProductData(rowData); setProductModalShow(true) }} />
            </>
        },
        { title: "NAME", field: "name" },
        {
            title: "Topics", field: "topics", render: (rowData) => <ul className="topics">
                {rowData.topics.length >= 1 ?

                    rowData?.topics?.map(curTopic => {
                        return (
                            <>
                                <li>{curTopic?.topic}</li>
                            </>
                        )
                    })

                    : ""

                }
            </ul>
        },

        {
            title: "DATE",
            field: "date",
            render: (rowData) =>
                moment(rowData?.created_ts).format("MMM Do YYYY, h:mm:ss a"),
        },

        {
            title: "ACTION",
            field: "action",
            align: "right",
            render: (rowData) => (
                <div className="actionBtn">

                    {user && (user.role === "all") &&
                        <>
                            <button
                                onClick={() => {
                                    setSelected(rowData._id);
                                    setDeleteModalShow(true);
                                }}
                                className="delete"
                            >
                                Delete
                            </button>

                            <button
                                onClick={() => {
                                    setModalShow(true);
                                    setSelectedData(rowData)
                                }}
                                className="exportBtn"
                            >
                                Edit
                            </button>
                        </>
                    }
                </div>
            ),
        },
    ];

    const handleExport = () => {
        const fileData = data.map((tableData) => ({
            id: tableData._id,
            User: tableData?.user?.name,
            ReportedService: tableData?.product?.title,
            Cause_Of_Report: tableData?.causeOfReport?.category,
            Date: moment(tableData?.created_ts).format('MMM Do YYYY, h:mm:ss a'),
            StatusMessage: tableData?.statusMessage,
            Reply: tableData?.message,
            Status: tableData?.status ? tableData?.status : "Pending",
            ReportedBy: tableData?.handledBy,
        }));

        const csv = papaparse.unparse(fileData);
        const link = document.createElement("a");
        link.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
        link.download = "data.csv";
        link.click();
    };

    const myFunction = async () => {
        try {
            await Axios.post(`${BASEURL}api/crm/delete-category`, { id: selected });
            toast("Delete successfully", {
                position: "bottom-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setDeleteModalShow(false);
            setRender(true);
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    };

    return (
        <>
            <ToastContainer />
            <DeleteModal
                show={deleteModalShow}
                onHide={() => setDeleteModalShow(false)}
                myFunction={myFunction}
            />
            <ProductModal
                show={productModalShow}
                onHide={() => setProductModalShow(false)}
                selectedProductData={selectedProductData}
            />
            <ManagementModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                setRender={setRender}
                selectedData={selectedData}
            />
            <MaterialTable
                title={
                    <div className="exportBtnBox">
                        <button className="exportBtn" onClick={handleExport}>
                            Export
                        </button>
                    </div>
                }
                data={data}
                columns={columns}
                icons={tableIcons}
                options={{ actionsColumnIndex: -1, addRowPosition: "first", pageSize: 10 }}
            />
        </>
    );
};

export default UserList;




function ManagementModal(props) {
    console.log("props", props.selectedData)
    const [image, setImage] = useState("")
    const [category, setCategory] = useState("")
    const [topic, setTopic] = useState("")
    const [topicData, setTopicData] = useState("")

    const fetchData = async () => {
        await Axios.get(`${BASEURL}api/crm/get-categories`)
            .then(data => {
                setTopic(data.data.data)
                console.log("data", data.data.data)
            })
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const formData = new FormData();
            formData.append("id", props.selectedData._id)
            formData.append("name", category);
            formData.append("image", image);
            formData.append("topics", topic);

            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            };

            await Axios.post(`${BASEURL}api/crm/edit-category`, formData, config)
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
                        props.setRender(true)
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

    const handleTopic = () => {
        setTopic([...topic, topicData])
        setTopicData("")
    }

    const handleRemoveTopic = (index) => {
        const newTopic = [...topic];
        newTopic.splice(index, 1);
        setTopic(newTopic);
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
                        {topic && topic.map(curElt => {
                            if (curElt._id === props.selectedData._id) {
                                return (
                                    <>

                                        <ul>
                                            {curElt?.topics?.map((curTopic, index) => {
                                                console.log("topic", curTopic)
                                                return (
                                                    <>
                                                        <li>
                                                            {index + 1} = {curTopic?.topic}
                                                            <a style={{ color: "red", marginLeft: "10px" }} type="button" onClick={(index) => handleRemoveTopic(index)}>
                                                                <FontAwesomeIcon icon={faTrash} />
                                                            </a>
                                                        </li>
                                                    </>
                                                )
                                            })}
                                        </ul>
                                    </>
                                )
                            }
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


function ProductModal(props) {
    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body>
                <div className="addCategoryModal reportedProblemModal">
                    <div className="closeModalBtn" onClick={props.onHide}>
                        <FontAwesomeIcon icon={faClose} />
                    </div>
                    <h4>Service Detail</h4>
                    <img src={props.selectedProductData?.image?.location} alt="image" className="img-fluid" />
                </div>
            </Modal.Body>
        </Modal>
    );
}