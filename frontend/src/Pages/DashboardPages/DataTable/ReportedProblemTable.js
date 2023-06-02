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

import { BASEURL } from "../../Constant";
import Modal from "react-bootstrap/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import Form from "react-bootstrap/Form";
import papaparse from "papaparse";
import { UserState } from "../../Context";
import DeleteModal from "../../Components/DeleteModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


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
    const [imgModalShow, setImgModalShow] = React.useState(false);
    const [data, setData] = useState([]);
    const [modalShow, setModalShow] = React.useState(false);
    const [render, setRender] = useState(false)
    const [deleteModalShow, setDeleteModalShow] = React.useState(false);
    const [selected, setSelected] = useState();
    const { user } = UserState();
    // console.log(data);

    useEffect(() => {
        if (render) setRender(false)
        getData();
    }, [render]);

    const getData = async () => {
        const userData = await Axios.get(`${BASEURL}api/crm/userreportedproblem`);
        // console.log("userData", userData.data.data);
        setData(userData.data.data);
    };

    const columns = [
        { title: "ID", field: "_id" },
        { title: "USER", field: "user.name" },
        { title: "CATEGORY", field: "category.category" },
        { title: "COMMENT", field: "comment" },
        {
            title: "SCREEN_SHOT",
            field: "file.location",
            render: (rowData) =>
                rowData?.file?.location ? (
                    <div className="tableImg">
                        <img
                            src={rowData?.file?.location}
                            onClick={() => {
                                setImgModalShow(true);
                                setSelectedData(rowData);
                            }}
                            alt="asad"
                            style={{ maxWidth: "50px" }}
                        />
                    </div>
                ) : (
                    "No Image"
                ),
        },
        {
            title: "DATE",
            field: "date",
            render: (rowData) =>
                moment(rowData?.created_ts).format("MMM Do YYYY, h:mm:ss a"),
        },
        {
            title: "STATUS",
            field: "statusData",
            render: (rowData) =>
                rowData.status === "Resolved" ? (
                    <span className="resolved">Resolved</span>
                ) : (
                    <span className="pending">Pending</span>
                ),
        },
        { title: "HANDELD_BY", field: "reportedBy" },
        {
            title: "ACTION",
            field: "action",
            align: "right",
            render: (rowData) => (
                <div className="actionBtn">
                    <button
                        onClick={() => {
                            setModalShow(true);
                            setSelectedData(rowData);
                        }}
                        className="response"
                    >
                        Action
                    </button>
                    {user && (user.role === "all") &&
                        <button
                            onClick={() => {
                                setSelected(rowData._id);
                                setDeleteModalShow(true);
                            }}
                            className="delete"
                        >
                            Delete
                        </button>
                    }
                </div>
            ),
        },
    ];

    const handleExport = () => {
        const fileData = data.map((tableData) => ({
            id: tableData._id,
            Name: tableData?.user?.name,
            Username: tableData?.user?.username,
            Category: tableData?.category?.category,
            Date: moment(tableData?.created_ts).format('MMM Do YYYY, h:mm:ss a'),
            Comment: tableData?.comment,
            Reply: tableData?.reply,
            Status: tableData?.status ? tableData?.status : "Pending",
        }));

        const csv = papaparse.unparse(fileData);
        const link = document.createElement("a");
        link.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
        link.download = "data.csv";
        link.click();
    };

    const myFunction = async () => {
        try {
            await Axios.post(`${BASEURL}/api/crm/delete-userreportedproblem`, { id: selected });
            toast("reported user delete successfully", {
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
            <ImageModal
                show={imgModalShow}
                onHide={() => setImgModalShow(false)}
                selectedData={selectedData}
            />
            <ManagementModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                setRender={setRender}
                selectedData={selectedData}
                user={user}
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
                options={{ actionsColumnIndex: -1, addRowPosition: "first" }}
            />
        </>
    );
};

export default UserList;

function ImageModal(props) {
    // console.log("image modal selectedData ", props.selectedData);
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
                    <h4>Problem Screen</h4>
                    <div className="imgModalPre">
                        <img
                            src={props?.selectedData?.file?.location}
                            className="img-fluid"
                        />
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}


function ManagementModal(props) {
    // console.log("props", props.selectedData)
    const [reply, setReply] = useState()
    const [status, setStatus] = useState()

    const handleStatus = (x) => {
        setStatus(x)
    }


    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            await Axios.post(`${BASEURL}api/crm/userreportedproblem`, { id: props?.selectedData?._id, status: status, reply: reply, reportedBy: props.user?.name })

            props.onHide()
            props.setRender(true)
            setReply('')
            setStatus('')

        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        if (props?.selectedData) {
            setReply(props?.selectedData?.reply)
        }
    }, [props])

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
                    {/* <div className="reportProbModalImg">
                        <img src={props.selectedData?.file?.location} />
                    </div> */}
                    <h4>Take Action</h4>
                    <ul>
                        <li><span>Name:</span> {props.selectedData?.user?.name}</li>
                        <li><span>Username:</span> {props.selectedData?.user?.username}</li>
                        <li><span>Id:</span> {props.selectedData?.user?._id}</li>
                    </ul>
                    <form>
                        <div className="formRadioGroup">
                            {["radio"].map((type) => (
                                <div key={`inline-${type}`} className="mb-3">
                                    <Form.Check
                                        inline
                                        label="Pending"
                                        name="group1"
                                        type={type}
                                        id={`inline-${type}-1`}
                                        value="Pending"
                                        onChange={(e) => handleStatus(e.target.value)}
                                    // checked={props?.selectedData?.status === "Pending" || props?.selectedData?.status === null ? true : false}
                                    />
                                    <Form.Check
                                        inline
                                        label="Resolved"
                                        name="group1"
                                        type={type}
                                        id={`inline-${type}-2`}
                                        value="Resolved"
                                        onChange={(e) => handleStatus(e.target.value)}
                                    // checked={props?.selectedData?.status === "Resolved" ? true : false}
                                    />


                                </div>
                            ))}
                        </div>
                        <div className="formInput">
                            <textarea
                                type="text"
                                name="reply"
                                id="reply"
                                placeholder="reply"
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                                rows={5}
                                cols={5}
                            ></textarea>
                        </div>
                        <div className="formBtn">
                            <button type="button" onClick={handleSubmit}>Done</button>
                        </div>
                    </form>
                </div>
            </Modal.Body>
        </Modal>
    );
}
