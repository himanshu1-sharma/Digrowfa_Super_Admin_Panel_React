import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Axios from "axios";
import { BASEURL } from "../../Constant";
import Form from "react-bootstrap/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faClose } from "@fortawesome/free-solid-svg-icons";
import DeleteModal from "../../Components/DeleteModal";
import Modal from 'react-bootstrap/Modal';



const columns = [
    { id: "_id", label: "SUPER_CATEGORY", minWidth: 100 },
    { id: "category", label: "CATEGORY", minWidth: 100, align: "right" },
    // { id: "category", label: "SUB_CATEGORY", minWidth: 100, align: "right" },
];

export default function StickyHeadTable() {
    const [superCategoryData, setsuperCategoryData] = useState();
    const [categoryData, setCategoryData] = useState();
    // const [subCategoryData, setSubCategoryData] = useState();
    const [modalShow, setModalShow] = React.useState(false);
    const [parentId, setParentId] = useState();
    const [childId, setChildId] = useState();
    const [deleteModal, setDeleteModal] = useState(false)
    const [selected, setSelected] = useState({})
    const [render, setRender] = useState(false)




    const handleType = async (x) => {
        try {
            let data;
            if (x == "All") {
                data = await Axios.get(`${BASEURL}api/category`);
                setsuperCategoryData(data.data.data);
                setCategoryData("");
                // setSubCategoryData("");
            } else if (x == "service") {
                data = await Axios.get(`${BASEURL}api/category/service`);
                setsuperCategoryData(data.data.data);
                setCategoryData("");
                // setSubCategoryData("");
            } else if (x == "product") {
                data = await Axios.get(`${BASEURL}api/category/product`);
                setsuperCategoryData(data.data.data);
                setCategoryData("");
                // setSubCategoryData("");
            } else console.log("No Value Selected");
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleSuperCategoryData = async (id) => {
        try {
            let categoryData;
            categoryData = await Axios.post(`${BASEURL}api/category/categories`, {
                superCategoryId: id,
            });
            setCategoryData(categoryData.data.data);
            setParentId(id);
            // setSubCategoryData("");
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleCategoryData = async (id, superId) => {
        try {
            let categoryDataList;
            categoryDataList = await Axios.post(
                `${BASEURL}api/category/sub-categories`,
                { parentCategoryId: id, superCategoryId: superId }
            );
            // setSubCategoryData(categoryDataList.data.data);
            setChildId(id);
            setParentId(superId);
        } catch (error) {
            console.log(error.message);
        }
    };

    const myFunction = async () => {
        try {
            await Axios.post(`${BASEURL}api/category/delete`, { categoryId: selected })
            setDeleteModal(false)
            setRender(true)
        } catch (error) {
            console.log(error.message)
        }

    }

    useEffect(() => {
        if (render) setRender(false)

    }, [render]);

    return (
        <>
            <DeleteModal
                show={deleteModal}
                onHide={() => setDeleteModal(false)}
                myFunction={myFunction}
            />
            <CategoryEditModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                selected={selected}
                setRender={setRender}
            />
            <div className="exportBtnBox">
                <div className="chooseCategoryTable">
                    <Form>
                        {["radio"].map((type) => (
                            <div key={`inline-${type}`} className="mb-3">
                                <Form.Check
                                    inline
                                    label="Profile"
                                    name="group1"
                                    type={type}
                                    id={`inline-${type}-1`}
                                    value="All"
                                    onChange={(e) => handleType(e.target.value)}
                                />
                                <Form.Check
                                    inline
                                    label="Product"
                                    name="group1"
                                    type={type}
                                    id={`inline-${type}-2`}
                                    value="product"
                                    onChange={(e) => handleType(e.target.value)}
                                />

                                <Form.Check
                                    inline
                                    label="Service"
                                    name="group1"
                                    type={type}
                                    id={`inline-${type}-3`}
                                    value="service"
                                    onChange={(e) => handleType(e.target.value)}
                                />
                            </div>
                        ))}
                    </Form>
                </div>
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
                            {superCategoryData ? (
                                <TableRow
                                    role="checkbox"
                                    tabIndex={-1}
                                    className="categoryTable"
                                >
                                    <TableCell>
                                        <ul>
                                            {superCategoryData &&
                                                superCategoryData.map((curElt) => {
                                                    return (
                                                        <>
                                                            <li
                                                                className={
                                                                    parentId === curElt._id ? "active" : ""
                                                                }
                                                                onClick={() =>
                                                                    handleSuperCategoryData(curElt._id)
                                                                }
                                                            >
                                                                {curElt.name} <br /> <small>{curElt._id}</small>
                                                                <br />
                                                                <div className="categoryActionBtn">
                                                                    <button className="delete" onClick={() => { setSelected(curElt._id); setDeleteModal(true) }}><FontAwesomeIcon icon={faTrash} /></button>
                                                                    <button className="update" onClick={() => { setSelected({ "id": curElt._id, "name": curElt.name }); setModalShow(true) }}><FontAwesomeIcon icon={faEdit} /></button>
                                                                </div>
                                                            </li>
                                                        </>
                                                    );
                                                })}
                                        </ul>
                                    </TableCell>
                                    <TableCell align="right">
                                        <ul>
                                            {categoryData &&
                                                categoryData.map((curCategory) => {
                                                    return (
                                                        <>
                                                            <li
                                                                className={
                                                                    parentId === curCategory.superParent &&
                                                                        childId === curCategory._id
                                                                        ? "active"
                                                                        : ""
                                                                }
                                                                onClick={() =>
                                                                    handleCategoryData(
                                                                        curCategory._id,
                                                                        curCategory.superParent
                                                                    )
                                                                }
                                                            >
                                                                {curCategory.name} <br />{" "}
                                                                <small>{curCategory._id}</small>
                                                                <br />
                                                                <div className="categoryActionBtn">
                                                                    <button className="delete" onClick={() => { setSelected(curCategory._id); setDeleteModal(true) }}><FontAwesomeIcon icon={faTrash} /></button>
                                                                    <button className="update" onClick={() => { setSelected({ "id": curCategory._id, "name": curCategory.name }); setModalShow(true) }}><FontAwesomeIcon icon={faEdit} /></button>
                                                                </div>
                                                            </li>
                                                        </>
                                                    );
                                                })}
                                        </ul>
                                    </TableCell>
                                    {/* <TableCell align="right">
                                        <ul>
                                            {subCategoryData &&
                                                subCategoryData.map((curSubCategory) => {
                                                    return (
                                                        <>
                                                            <li>
                                                                {curSubCategory.name} <br />{" "}
                                                                <small>{curSubCategory._id}</small>
                                                                <br />
                                                                <div className="categoryActionBtn">
                                                                    <button className="delete" onClick={() => { setSelected(curSubCategory._id); setDeleteModal(true) }}><FontAwesomeIcon icon={faTrash} /></button>
                                                                    <button className="update" onClick={() => { setSelected({ "id": curSubCategory._id, "name": curSubCategory.name }); setModalShow(true) }}><FontAwesomeIcon icon={faEdit} /></button>
                                                                </div>
                                                            </li>
                                                        </>
                                                    );
                                                })}
                                        </ul>
                                    </TableCell> */}
                                </TableRow>
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3}>
                                        <div className="blackCategoryBox">
                                            Please Select Category
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </>
    );
}

function CategoryEditModal(props) {
    const [name, setName] = useState()
    // console.log("props", props)
    const updateCategoryName = async (e) => {
        e.preventDefault()
        try {
            await Axios.post(`${BASEURL}api/category/edit`, { categoryId: props.selected?.id, name: name })
            setName()
            props.setRender(true)
            props.onHide()
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
                        <div className="formInput">
                            <input
                                type="text"
                                name="name"
                                id="name"
                                placeholder={props.selected?.name}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="formBtn">
                            <button type="button" onClick={updateCategoryName}>Done</button>
                        </div>
                    </form>
                </div>
            </Modal.Body>
        </Modal>
    );
}