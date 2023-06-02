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
import papaparse from 'papaparse'
import addIcon from "../../../img/icons/addIconWhite.png"
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose } from '@fortawesome/free-solid-svg-icons'
import DeleteModal from "../../Components/DeleteModal";





const columns = [
    // { id: "sno", label: "SNO.", minWidth: 170 },

    { id: "_id", label: "ID", minWidth: 170 },
    { id: "category", label: "REASON", minWidth: 100 },
    { id: "action", label: "ACTION", minWidth: 170, align: 'right', }
];





export default function StickyHeadTable() {

    const [data, setData] = useState()
    const [modalShow, setModalShow] = React.useState(false);
    const [render, setRender] = useState(false)
    const [selected, setSelected] = useState({})
    const [deleteModal, setDeleteModal] = useState(false)

    const fetchData = () => {
        Axios.get(`${BASEURL}api/report/user-issues`)
            .then(data => {
                setData(data.data.data)
                // console.log("setData", data.data.data)
            })
    }

    useEffect(() => {
        if (render) setRender(false)
        fetchData()
    }, [render])

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
        const fileData = data.map(tableData => (
            {
                id: tableData._id,
                Reason: tableData.category
            }
        ))

        const csv = papaparse.unparse(fileData)
        const link = document.createElement('a');
        link.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        link.download = 'data.csv';
        link.click();
    }

    const myFunction = async () => {
        try {
            await Axios.delete(`${BASEURL}delete-report-user-issue/${selected}`)
            setRender(true)
            setDeleteModal(false)

        } catch (error) {
            console.log(error.message)
        }

    }

    return (
        <>
            <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                setRender={setRender}
            />
            <DeleteModal
                show={deleteModal}
                onHide={() => setDeleteModal(false)}
                myFunction={myFunction}
            />
            <div className="exportBtnBox">
                <button className="dashboardAddBtn" onClick={() => setModalShow(true)}><img src={addIcon} alt="addIcon" className='img-fluid' /> Add Reason</button>
                <button className="exportBtn" onClick={handleExport}>Export</button>
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
                            {data && data.length > 0 && data
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                            {columns.map((column, index) => {
                                                const value = row[column.id];
                                                {/* console.log("index", index) */}
                                                return (
                                                    <>
                                                        <TableCell key={column.id} align={column.align}>

                                                            {column.format && typeof value === "number"
                                                                ? column.format(value)
                                                                : value}

                                                            {index >= "2" &&
                                                                <>
                                                                    <div className="actionBtn">
                                                                        <button onClick={() => { setSelected(row._id); setDeleteModal(true) }} className="delete">delete</button>
                                                                    </div>
                                                                </>
                                                            }
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



function MyVerticallyCenteredModal(props) {
    const [input, setInput] = useState("")
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await Axios.post(`${BASEURL}save-report-user-issue`, { categoryInput: input })
            props.onHide()
            setInput()
            props.setRender(true)

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
                <div className='addCategoryModal'>
                    <div className='closeModalBtn' onClick={props.onHide}>
                        <FontAwesomeIcon icon={faClose} />
                    </div>
                    <h4>Add User Reporting Reason</h4>
                    <form>
                        <div className='formInput'>
                            <input type="text" name="reason" id="reason" placeholder='Title' value={input} onChange={(e) => setInput(e.target.value)} />
                        </div>
                        <div className='formBtn'>
                            <button type="button" onClick={handleSubmit}>Done</button>
                        </div>
                    </form>
                </div>
            </Modal.Body>
        </Modal>
    );
}