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
import papaparse from "papaparse";
import DeleteModal from "../../Components/DeleteModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import Form from "react-bootstrap/Form";
import { UserState } from "../../Context";

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => (
        <ChevronRight {...props} ref={ref} />
    )),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => (
        <ChevronLeft {...props} ref={ref} />
    )),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

const UserList = () => {
    const [data, setData] = useState([]);
    const [modalShow, setModalShow] = React.useState(false);
    const [render, setRender] = useState(false);
    const [page, setPage] = React.useState(1);
    const [selected, setSelected] = useState();
    const [selectedData, setSelectedData] = useState();
    const [actionModal, setActionModal] = React.useState(false);
    const [dummyUserCount, setDummyUserCount] = useState()
    const { user } = UserState();
    const navigate = useNavigate();

    const fetchDummyData = async () => {
        try {
            await Axios.get(`${BASEURL}api/crm/admin/get-all-demo-users`)
                .then(data => {
                    setDummyUserCount(data.data.data)
                })
        } catch (error) {
            console.log(error.msg)
        }
    }

    const getData = async (x) => {
        // console.log("x", x)
        let userData;
        if (x === "All") {
            userData = await Axios.post(`${BASEURL}api/crm/get-all-users?page=${page}`);
            // console.log("userData", userData.data.data);
            setData(userData.data.data);
        }
        else if (x === "Dummy") {
            userData = await Axios.get(`${BASEURL}api/crm/admin/get-all-demo-users`);
            // console.log("userData", userData.data.data);
            setData(userData.data.data);

        }
        else {
            userData = await Axios.post(`${BASEURL}api/crm/get-all-users?page=${page}`);
            // console.log("userData", userData.data.data);
            setData(userData.data.data);
        }

    };
    useEffect(() => {
        if (render) setRender(false);
        getData();
        fetchDummyData()
    }, [page, render]);

    const nextPage = () => {
        setPage(function (newPage) {
            return (newPage += 1);
        });
    };

    const prevPage = () => {
        setPage(function (newPage) {
            return (newPage -= 1);
        });
    };


    const myFunction = async () => {
        try {
            await Axios.post(`${BASEURL}api/crm/admin/delete-user`, {
                userId: selected,
            });
            toast("user status change successfully", {
                position: "bottom-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setModalShow(false);
            setRender(true);
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    };

    const columns = [
        { title: "ID", field: "_id" },
        {
            title: "NAME",
            field: "name",
        },
        {
            title: "Handle",
            field: "username",
        },
        {
            title: `Dummy User (${dummyUserCount?.length})`,
            field: "dummy",
            render: (rowData) =>
                rowData.isDummy ? (
                    <span className="resolved">Yes</span>
                ) : (
                    <span className="suspend">No</span>
                ),
        },

        {
            title: "STATUS",
            field: "statusData",
            render: (rowData) =>
                rowData.isSuspended ? (
                    <span className="suspend">suspended</span>
                ) : (
                    <span className="resolved">Active</span>
                ),
        },
        { title: "RESONE", field: "statusMessage" },
        { title: "MANAGED_BY", field: "reportedBy" },

        {
            title: "ACTION",
            field: "action",

            render: (rowData) => (
                <div className="actionBtn">
                    {rowData.isSuspended ? (
                        <button
                            onClick={() => {
                                setActionModal(true);
                                setSelectedData(rowData);
                            }}
                            className="activate"
                        >
                            Activate
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                setActionModal(true);
                                setSelectedData(rowData);
                            }}
                            className="suspended"
                        >
                            Suspend
                        </button>
                    )}
                    {user && (user.role === "all") &&
                        <button
                            onClick={() => {
                                setSelected(rowData._id);
                                setModalShow(true);
                            }}
                            className="delete"
                        >
                            Delete
                        </button>
                    }
                </div>
            ),
        },
        {
            title: "VIEW",
            field: "view",
            align: "right",
            render: (rowData) => (
                <div className="actionBtn">
                    <button
                        onClick={() => {
                            navigate(`/user-detail/${rowData.username}/${rowData._id}`);
                        }}
                        className="response"
                    >
                        View
                    </button>
                </div>
            ),
        },
    ];

    const handleExport = () => {
        const fileData = data.map((tableData) => ({
            id: tableData._id,
            Name: tableData?.name,
            Username: tableData?.username,
            BMC: tableData?.bmc.length === 1 ? "Yes" : "No",
            Status: tableData?.isSuspended ? "suspended" : "Active",
            Resone: tableData?.statusMessage,
            Managed_By: tableData?.reportedBy,
        }));

        const csv = papaparse.unparse(fileData);
        const link = document.createElement("a");
        link.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
        link.download = "data.csv";
        link.click();
    };



    return (
        <>
            <ToastContainer />

            <DeleteModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                myFunction={myFunction}
            />

            <ActionModal
                show={actionModal}
                onHide={() => setActionModal(false)}
                selectedData={selectedData}
                setRender={setRender}
                user={user}
            />

            <MaterialTable
                title={
                    <div className="exportBtnBox">
                        <button className="exportBtn" onClick={handleExport}>
                            Export
                        </button>
                        <div className="nextPrevBtn">
                            <button onClick={prevPage}>prev</button>
                            <button onClick={nextPage}>next</button>
                        </div>
                        <Form>
                            {["radio"].map((type) => (
                                <div key={`inline-${type}`} className="mb-3">
                                    <Form.Check
                                        inline
                                        label="All"
                                        name="group1"
                                        type={type}
                                        id={`inline-${type}-1`}
                                        value="All"
                                        onChange={(e) => getData(e.target.value)}
                                    />
                                    <Form.Check
                                        inline
                                        label="Dummy"
                                        name="group1"
                                        type={type}
                                        id={`inline-${type}-2`}
                                        value="Dummy"
                                        onChange={(e) => getData(e.target.value)}
                                    />
                                </div>
                            ))}
                        </Form>
                    </div>
                }
                data={data}
                columns={columns}
                icons={tableIcons}
                options={{
                    actionsColumnIndex: -1,
                    addRowPosition: "first",
                    pageSize: 100,
                }}
            />

        </>
    );
};

export default UserList;

function ActionModal(props) {
    const [reply, setReply] = useState();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await Axios.post(`${BASEURL}api/crm/admin/block-user`, {
                userId: props.selectedData?._id,
                message: reply,
                reportedBy: props.user?.name,
            });
            toast("user status change successfully", {
                position: "bottom-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            props.setRender(true);
            props.onHide();
            setReply("");
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    };

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
                    <div className="d-flex justify-content-between">
                        <div>
                            <ul>
                                <li>
                                    <span>Name:</span> {props.selectedData?.name}
                                </li>
                                <li>
                                    <span>Username:</span> {props.selectedData?.username}
                                </li>
                                <li>
                                    <span>Id:</span> {props.selectedData?._id}
                                </li>
                            </ul>
                        </div>
                    </div>
                    <hr />
                    <form>
                        <div className="formRadioGroup">
                            {["radio"].map((type) => (
                                <div key={`inline-${type}`} className="mb-3">
                                    <Form.Check
                                        inline
                                        label={
                                            props.selectedData?.isSuspended ? "Activate" : "Suspend"
                                        }
                                        name="group1"
                                        type={type}
                                        id={`inline-${type}-1`}
                                        value={
                                            props.selectedData?.isSuspended ? "Activate" : "Suspend"
                                        }
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
                            <button type="button" onClick={handleSubmit}>
                                Done
                            </button>
                        </div>
                    </form>
                </div>
            </Modal.Body>
        </Modal>
    );
}
