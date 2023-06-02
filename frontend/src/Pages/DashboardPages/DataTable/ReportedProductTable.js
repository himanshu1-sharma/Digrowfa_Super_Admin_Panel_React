import React, { forwardRef, useEffect, useState } from "react";
import Axios from "axios";
import MaterialTable from "material-table";
import Accordion from "react-bootstrap/Accordion";
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
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/scrollbar";
import { Scrollbar } from "swiper";
import DeleteModal from "../../Components/DeleteModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

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
    const [selectedData, setSelectedData] = useState("");
    const [selectedProductData, setSelectedProductData] = useState("");
    const [data, setData] = useState([]);
    const [modalShow, setModalShow] = React.useState(false);
    const [productModalShow, setProductModalShow] = React.useState(false);
    const [render, setRender] = useState(false);
    const [deleteModalShow, setDeleteModalShow] = React.useState(false);
    const [selected, setSelected] = useState();
    const { user, setUser } = UserState();
    // console.log(data);

    useEffect(() => {
        if (render) setRender(false);
        getData();
    }, [render]);

    const getData = async () => {
        const userData = await Axios.get(`${BASEURL}api/report/report-product`);
        // console.log("api/report/report-product", userData.data.data);
        setData(userData.data.data);
    };

    const columns = [
        { title: "ID", field: "_id" },
        {
            title: "USER",
            field: "user.username",
        },
        {
            title: "REPORTED Product",
            field: "reportedUserData",
            render: (rowData) => (
                <>
                    <img
                        src={rowData?.product?.image1?.location}
                        alt=""
                        className="img-fluid productPreviewImg"
                        onClick={() => {
                            setSelectedProductData(rowData);
                            setProductModalShow(true);
                        }}
                    />
                </>
            ),
        },
        { title: "Cause_Of_Report", field: "reason.category" },

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
                ) : rowData.status === "Ongoing" ? (
                    <span className="ongoing">Ongoing</span>
                ) : (
                    <span className="pending">Pending</span>
                ),
        },
        { title: "REPLY", field: "message" },
        { title: "MANAGED_BY", field: "handledBy" },
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
                    {user && user.role === "all" && (
                        <button
                            onClick={() => {
                                setSelected(rowData._id);
                                setDeleteModalShow(true);
                            }}
                            className="delete"
                        >
                            Delete
                        </button>
                    )}
                </div>
            ),
        },
    ];

    const handleExport = () => {
        const fileData = data.map((tableData) => ({
            id: tableData._id,
            User: tableData?.user?.name,
            ReportedProduct: tableData?.product?.title,
            Cause_Of_Report: tableData?.causeOfReport?.category,
            Date: moment(tableData?.created_ts).format("MMM Do YYYY, h:mm:ss a"),
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
            await Axios.delete(`${BASEURL}api/report/report-product/${selected}`);
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
                options={{
                    actionsColumnIndex: -1,
                    addRowPosition: "first",
                    pageSize: 10,
                }}
            />
        </>
    );
};

export default UserList;

function ManagementModal(props) {
    // console.log("props", props);
    const [reply, setReply] = useState();
    const [status, setStatus] = useState();
    const { user, setUser } = UserState();
    const [getReportReason, setGetReportReason] = useState("");
    const [reportReason, setReportReason] = useState("");

    const reportReasonData = async () => {
        try {
            await Axios.get(`${BASEURL}api/report/report-product-reasons`).then(
                (data) => {
                    setReportReason(data.data.data);
                }
            );
        } catch (error) {
            console.log(error.message);
        }
    };

    // console.log("getReportReason", getReportReason);

    const handleStatus = (x) => {
        setStatus(x);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await Axios.put(`${BASEURL}api/report/report-product`, {
                id: props?.selectedData,
                status: status,
                message: reply,
                handledBy: user?.name,
            });

            props.onHide();
            props.setRender(true);
            setReply("");
            setStatus("");
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleReportedUser = async (e) => {
        e.preventDefault();
        // console.log("productID :", props?.selectedData?.product?._id);
        // console.log("reportedUserId :", props?.selectedData?.product?.user);
        // console.log("reportReasonId :", getReportReason);
        // console.log("reply :", reply);

        try {
            await Axios.post(`${BASEURL}api/report/report-violation-product`, {
                productId: props?.selectedData?.product?._id,
                reportedUserId: props?.selectedData?.product?.user,
                reportReasonId: getReportReason,
                reply: reply,
            }).then((data) => { });
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        if (props?.selectedData) {
            setReply(props?.selectedData?.statusMessage);
            // console.log("props?.selectedData", props?.selectedData);
            setGetReportReason(props?.selectedData?.reason?._id);
        }
        reportReasonData();
    }, [props]);
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
                    <h4>Take Action</h4>
                    <Tabs
                        defaultActiveKey="Reporter"
                        id="fill-tab-example"
                        className="mb-3"
                        fill
                    >
                        <Tab eventKey="Reporter" title="Reply to Reporter">
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
                                            />
                                            <Form.Check
                                                inline
                                                label="Ongoing"
                                                name="group1"
                                                type={type}
                                                id={`inline-${type}-2`}
                                                value="Ongoing"
                                                onChange={(e) => handleStatus(e.target.value)}
                                            />
                                            <Form.Check
                                                inline
                                                label="Resolved"
                                                name="group1"
                                                type={type}
                                                id={`inline-${type}-2`}
                                                value="Resolved"
                                                onChange={(e) => handleStatus(e.target.value)}
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
                        </Tab>
                        <Tab eventKey="Reported" title="Reply to Reported User">
                            <form>
                                <div className="formInput">
                                    <select
                                        value={getReportReason}
                                        onChange={(e) => {
                                            setGetReportReason(e.target.value);
                                        }}
                                    >
                                        <option value={props.selectedData?.reason?._id}>
                                            {props.selectedData?.reason?.category}
                                        </option>
                                        {reportReason &&
                                            reportReason?.map((curElt) => {
                                                return (
                                                    <>
                                                        <option value={curElt?._id}>
                                                            {curElt?.category}
                                                        </option>
                                                    </>
                                                );
                                            })}
                                    </select>
                                </div>
                                <div className="formInput mt-3">
                                    <textarea
                                        type="text"
                                        name="reply"
                                        id="reply"
                                        placeholder="Reply to reported user"
                                        value={reply}
                                        onChange={(e) => setReply(e.target.value)}
                                        rows={5}
                                        cols={5}
                                    ></textarea>
                                </div>
                                <div className="formBtn">
                                    <button type="button" onClick={handleReportedUser}>
                                        Done
                                    </button>
                                </div>
                            </form>
                        </Tab>
                    </Tabs>
                </div>
            </Modal.Body>
        </Modal>
    );
}

function ProductModal(props) {
    // console.log("product proips data", props);
    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body>
                <div className="addCategoryModal detail">
                    <div className="closeModalBtn" onClick={props.onHide}>
                        <FontAwesomeIcon icon={faClose} />
                    </div>
                    <div className="productImgModalContent">
                        <Swiper
                            scrollbar={{
                                hide: true,
                            }}
                            modules={[Scrollbar]}
                            className="mySwiper"
                        >
                            {props.selectedProductData?.product?.image1 ? (
                                <SwiperSlide>
                                    <div
                                        className="productImgPrev"
                                        style={{
                                            backgroundImage: `url(${props.selectedProductData?.product?.image1?.location})`,
                                        }}
                                    ></div>
                                </SwiperSlide>
                            ) : (
                                ""
                            )}

                            {props.selectedProductData?.product?.image2 ? (
                                <SwiperSlide>
                                    <div
                                        className="productImgPrev"
                                        style={{
                                            backgroundImage: `url(${props.selectedProductData?.product?.image2?.location})`,
                                        }}
                                    ></div>
                                </SwiperSlide>
                            ) : (
                                ""
                            )}
                            {props.selectedProductData?.product?.image3 ? (
                                <SwiperSlide>
                                    <div
                                        className="productImgPrev"
                                        style={{
                                            backgroundImage: `url(${props.selectedProductData?.product?.image3?.location})`,
                                        }}
                                    ></div>
                                </SwiperSlide>
                            ) : (
                                ""
                            )}
                            {props.selectedProductData?.product?.image4 ? (
                                <SwiperSlide>
                                    <div
                                        className="productImgPrev"
                                        style={{
                                            backgroundImage: `url(${props.selectedProductData?.product?.image4?.location})`,
                                        }}
                                    ></div>
                                </SwiperSlide>
                            ) : (
                                ""
                            )}
                            {props.selectedProductData?.product?.image5 ? (
                                <SwiperSlide>
                                    <div
                                        className="productImgPrev"
                                        style={{
                                            backgroundImage: `url(${props.selectedProductData?.product?.image5?.location})`,
                                        }}
                                    ></div>
                                </SwiperSlide>
                            ) : (
                                ""
                            )}
                        </Swiper>
                        <h4 className="mt-3">
                            {props.selectedProductData?.product?.title}
                        </h4>
                        <h4>₹{props.selectedProductData?.product?.price}</h4>
                        <Accordion>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>Description</Accordion.Header>
                                <Accordion.Body>
                                    {props.selectedProductData?.product?.description}
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="1">
                                <Accordion.Header>Product details</Accordion.Header>
                                <Accordion.Body>
                                    <ul>
                                        {props.selectedProductData?.product?.detail.map(
                                            (curElt) => {
                                                if (curElt.length >= 1) {
                                                    return (
                                                        <>
                                                            <li>{curElt}</li>
                                                        </>
                                                    );
                                                }
                                            }
                                        )}
                                    </ul>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}
