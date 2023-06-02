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
import { UserState } from '../../Context'
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
    const [data, setData] = useState([]);
    const [render, setRender] = useState(false)
    const [deleteModalShow, setDeleteModalShow] = React.useState(false);
    const [selected, setSelected] = useState();
    const { user, setUser } = UserState();

    useEffect(() => {
        if (render) setRender(false)
        getData();
    }, [render]);

    const getData = async () => {
        const userData = await Axios.get(`${BASEURL}api/crm/feedback`);
        // console.log("api/report/report-product", userData.data.data);
        setData(userData.data.data);
    };

    const columns = [
        { title: "ID", field: "_id" },
        {
            title: "USERNAME", field: "user.username"
        },
        { title: "COMMENT", field: "comment" },

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
            await Axios.delete(`${BASEURL}api/crm/delete-feedback/${selected}`);
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
            setDeleteModalShow(false);
            setRender(true);
        } catch (error) {
            // console.log(error.message);
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





