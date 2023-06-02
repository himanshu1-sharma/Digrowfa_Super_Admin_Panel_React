import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Axios from "axios";
import { BASEURL } from "../../Constant";
import papaparse from "papaparse";
import addIcon from "../../../img/icons/addIconWhite.png";
import Modal from "react-bootstrap/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import Form from "react-bootstrap/Form";
import editProfile from "../../../img/icons/editProfile.webp";
import DeleteModal from "../../Components/DeleteModal";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserState } from "../../Context";

const columns = [
    // { id: "sno", label: "SNO.", minWidth: 170 },

    { id: "_id", label: "ID", minWidth: 100 },
    { id: "name", label: "NAME", minWidth: 100 },
    { id: "email", label: "USER EMAIL", minWidth: 100 },
    { id: "password", label: "PASSWORD", minWidth: 100 },
    { id: "department", label: "DEPARTMENT", minWidth: 100 },
    { id: "role", label: "ROLE", minWidth: 100 },
    { id: "action", label: "ACTION", minWidth: 100, align: "right" },
    // { id: "action", label: "ACTION", minWidth: 170, align: 'right', }
];

export default function StickyHeadTable() {
    const [data, setData] = useState();
    const [modalShow, setModalShow] = React.useState(false);
    const [deleteModal, setDeleteModal] = useState(false)
    const [selected, setSelected] = useState({})
    const [render, setRender] = useState(false)
    const { user, setUser } = UserState();

    const fetchData = () => {
        Axios.post(`${BASEURL}api/crm/admin/managment`).then((data) => {
            setData(data.data.data);
            // console.log("setData", data.data.data);
        });
    };

    useEffect(() => {
        if (render) setRender(false)
        fetchData();
    }, [render]);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleExport = () => {
        const fileData = data

        const csv = papaparse.unparse(fileData);
        const link = document.createElement("a");
        link.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
        link.download = "data.csv";
        link.click();
    };

    const myFunction = async () => {
        try {
            await Axios.post(`${BASEURL}api/crm/admin/delete-managment`, { userId: selected })
            setDeleteModal(false)
            setRender(true)
        } catch (error) {
            console.log(error.message)
        }

    }

    

    return (
        <>
            <ToastContainer />
            <DeleteModal
                show={deleteModal}
                onHide={() => setDeleteModal(false)}
                myFunction={myFunction}
            />
            <ManagementModal show={modalShow} onHide={() => setModalShow(false)} setRender={setRender} />
            <div className="exportBtnBox">
                <button className="dashboardAddBtn" onClick={() => setModalShow(true)}>
                    <img src={addIcon} alt="addIcon" className="img-fluid" /> Add
                </button>
                <button className="exportBtn" onClick={handleExport}>
                    Export
                </button>
            </div>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data &&
                                data.length > 0 &&
                                data
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => {
                                        return (
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                tabIndex={-1}
                                                key={row.code}
                                            >
                                                {columns.map((column, index) => {
                                                    const value = row[column.id];
                                                    {/* console.log("index", index); */ }
                                                    return (
                                                        <>
                                                            <TableCell key={column.id} align={column.align}>
                                                                {column.format && typeof value === "number"
                                                                    ? column.format(value)
                                                                    : value}

                                                                {index >= "6" && (
                                                                    <>
                                                                        <div className="actionBtn">
                                                                            {/* <button onClick={() => handleSuspend(row._id)} className="suspended">{row.isSuspended ? "Activate" : "Suspend"}</button> */}
                                                                            {user && (user.role === "all") &&
                                                                                <button onClick={() => { setSelected(row._id); setDeleteModal(true) }} className="delete">delete</button>
                                                                            }
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </TableCell>
                                                        </>
                                                    );
                                                })}
                                            </TableRow>
                                        );
                                    })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={data?.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </>
    );
}

function ManagementModal(props) {

    // console.log("props", props)
    const [inputData, setInputData] = useState("")
    const [image, setImage] = useState("");
    const [imgPrev, setImgPrev] = useState(editProfile);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [department, setDepartment] = useState([]);
    const [role, setRole] = useState("");


    // console.log("department", department);
    const handleType = (e) => {
        const value = e.target.value;
        const check = e.target.checked;
        if (check) {
            setDepartment([...department, value]);
        } else {
            setDepartment(department.filter((x) => x !== value));
        }
    };

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        setImage(file);
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setImgPrev(reader.result);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleManager = (e) => {
        // console.log("department", department)

        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append("profilepic", image);
            formData.append("name", name);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("department", department)
            formData.append("role", role)

            // console.log("formData", formData)
            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            }

            Axios.post(`${BASEURL}api/crm/create-admin`, formData, config)
                .then(data => {
                    setInputData(data.data.data)
                    // console.log("setInputData", data.data.data)
                    props.onHide()
                    props.setRender(true)
                    setImage("")
                    setImgPrev("")
                    setName("")
                    setEmail("")
                    setPassword("")
                    setDepartment("")
                    setRole("")

                })

        } catch (error) {
            console.log(error.message)
        }
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
                    <h4>Add Managers</h4>
                    <form>
                        <div className="profileFormGroupImg">
                            <label for="file">
                                <img
                                    src={editProfile}
                                    alt="editProfile"
                                    className="img-fluid"
                                />
                            </label>
                            <input
                                type="file"
                                id="file"
                                name="file"
                                onChange={(e) => uploadFileHandler(e)}
                                hidden
                            />
                            <div
                                className="studentProfilePic"
                                style={{ backgroundImage: `url(${imgPrev})` }}
                            ></div>
                        </div>
                        <div className="formInput">
                            <input
                                type="text"
                                name="managerName"
                                id="managerName"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="formInput">
                            <input
                                type="email"
                                name="managerEmail"
                                id="managerEmail"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="formInput">
                            <input
                                type="password"
                                name="managerPassword"
                                id="managerPassword"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="formRadioGroup">
                            <p>Choose Department</p>
                            {["checkbox"].map((type) => (
                                <div key={`inline-${type}`} className="mb-3">
                                    <Form.Check
                                        inline
                                        label="Admin"
                                        name="group1"
                                        type={type}
                                        id={`inline-${type}-1`}
                                        value="All"
                                        onChange={handleType}
                                    />
                                    <Form.Check
                                        inline
                                        label="verification"
                                        name="group1"
                                        type={type}
                                        id={`inline-${type}-2`}
                                        value="verification"
                                        onChange={handleType}
                                    />

                                    <Form.Check
                                        inline
                                        label="users"
                                        name="group1"
                                        type={type}
                                        id={`inline-${type}-3`}
                                        value="users"
                                        onChange={handleType}
                                    />
                                    <Form.Check
                                        inline
                                        label="management"
                                        name="group1"
                                        type={type}
                                        id={`inline-${type}-3`}
                                        value="management"
                                        onChange={handleType}
                                    />
                                    <Form.Check
                                        inline
                                        label="feedbacks"
                                        name="group1"
                                        type={type}
                                        id={`inline-${type}-3`}
                                        value="feedbacks"
                                        onChange={handleType}
                                    />
                                    <Form.Check
                                        inline
                                        label="reported user"
                                        name="group1"
                                        type={type}
                                        id={`inline-${type}-3`}
                                        value="reported user"
                                        onChange={handleType}
                                    />
                                    <Form.Check
                                        inline
                                        label="reported problem"
                                        name="group1"
                                        type={type}
                                        id={`inline-${type}-3`}
                                        value="reported problem"
                                        onChange={handleType}
                                    />
                                    <Form.Check
                                        inline
                                        label="reported product"
                                        name="group1"
                                        type={type}
                                        id={`inline-${type}-3`}
                                        value="reported product"
                                        onChange={handleType}
                                    />
                                    <Form.Check
                                        inline
                                        label="reported service"
                                        name="group1"
                                        type={type}
                                        id={`inline-${type}-3`}
                                        value="reported service"
                                        onChange={handleType}
                                    />

                                </div>
                            ))}
                        </div>
                        <div className="formInput">
                            <select value={role} onChange={(e) => setRole(e.target.value)}>
                                <option selected>Select Role</option>
                                <option value="all">Admin</option>
                                <option value="management">Management Manager</option>
                                <option value="verification">Verification Manager</option>
                                <option value="user">User Manager</option>
                                {/* <option value="categories">Categories Manager</option> */}
                                <option value="feedback">Feedback Manager</option>
                                <option value="reportingUser">Reporting User Manager</option>
                                <option value="reportingProblem">Reporting Problem Manager</option>
                                <option value="reportingProduct">Reporting Product Manager</option>
                                <option value="reportingService">Reporting Service Manager</option>
                            </select>
                        </div>
                        <div className="formBtn">
                            <button type="button" onClick={handleManager}>Done</button>
                        </div>
                    </form>
                </div>
            </Modal.Body>
        </Modal>
    );
}
