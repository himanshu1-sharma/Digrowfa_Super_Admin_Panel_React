import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { BASEURL, APP_BASEURL } from "../../Constant";
import Axios from "axios";
import Header from "../../Includes/Header/Header";
import { useReactToPrint } from "react-to-print";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEnvelope,
    faPrint,
    faClose,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import Modal from "react-bootstrap/Modal";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/scrollbar";
import { Scrollbar } from "swiper";
import DeleteModal from "../../Components/DeleteModal";
import { UserState } from "../../Context";
import { Link } from "react-router-dom";
import ReactPlayer from 'react-player'

const UserDetail = () => {
    const [userData, setUserData] = useState();
    const params = useParams();
    const [imgModalShow, setImgModalShow] = React.useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selected, setSelected] = useState();
    const [selectedId, setSelectedId] = useState();
    const [render, setRender] = useState(false);
    const { user, setUser } = UserState();
    const [shout, setShout] = useState();

    const fetchUserData = async () => {
        try {
            await Axios.post(`${BASEURL}api/crm/admin/get-user-details`, {
                userId: params?.id,
            }).then((data) => {
                setUserData(data.data.data[0]);
                // console.log("user data", data.data.data[0]);
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    const fetchShoutData = async () => {
        try {
            await Axios.get(`${BASEURL}api/crm/getusershouts/${params.id}`, {
                userId: params?.id,
            }).then((data) => {
                setShout(data.data.data);
                console.log("shout", data.data.data);
            });
        } catch (error) {
            console.log(error.message);
        }
    }

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Digrowfa-Invoice",
    });

    const myFunction = async () => {
        try {
            await Axios.delete(`${BASEURL}api/products/${selectedId}`);
            setDeleteModal(false);
            setRender(true);
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        if (render) setRender(false);
        fetchUserData();
        fetchShoutData()
    }, [render, user]);

    return (
        <>
            <ImagePrevModal
                show={imgModalShow}
                onHide={() => setImgModalShow(false)}
                selected={selected}
            />
            <DeleteModal
                show={deleteModal}
                onHide={() => setDeleteModal(false)}
                myFunction={myFunction}
            />
            <Header />
            <div className="userDetailBg">
                <div className="container">
                    <div className="row d-flex justify-content-center">
                        <div className="col-lg-7 col-sm-12 col-12">
                            <div className="mt-3">
                                <Link to="/users">Go Back</Link>
                            </div>
                            <div className="userDetailTabs">
                                <Tabs
                                    defaultActiveKey="profile"
                                    id="justify-tab-example"
                                    className="mb-3"
                                    justify
                                >
                                    <Tab eventKey="profile" title="Profile Information">
                                        <div ref={componentRef} className="p-5">
                                            <div className="userDetailBox">
                                                <div
                                                    className="userDetailProfile"
                                                    style={{
                                                        backgroundImage: `url(${userData?.profilepic})`,
                                                    }}
                                                ></div>
                                                <div className="aboutUser">
                                                    <h1>{userData?.name}</h1>
                                                    <label>@{userData?.username}</label>
                                                    <p>{userData?.title}</p>
                                                </div>
                                            </div>

                                            <div className="userFollow">
                                                <ul>
                                                    <li>
                                                        <span>{userData?.following.length}</span>
                                                        <br />
                                                        Following
                                                    </li>
                                                    <li>
                                                        <span>{userData?.followers.length}</span>
                                                        <br />
                                                        Followers
                                                    </li>
                                                    <li>
                                                        <span>{userData?.products.length}</span>
                                                        <br />
                                                        Product
                                                    </li>
                                                    <li>
                                                        <span>{userData?.service.length}</span>
                                                        <br />
                                                        Service
                                                    </li>
                                                    <li>
                                                        <span>
                                                            {userData?.bmc.length === 1 ? "Yes" : "No"}
                                                        </span>
                                                        <br />
                                                        BMC
                                                    </li>
                                                    <li>
                                                        <span>
                                                            {shout?.length}
                                                        </span>
                                                        <br />
                                                        Shout
                                                    </li>
                                                </ul>
                                            </div>

                                            <div className="userDetailBtn">
                                                <a href={`mailto:${userData?.email}`}>
                                                    <button>
                                                        <FontAwesomeIcon icon={faEnvelope} /> Mail
                                                    </button>
                                                </a>
                                                <button onClick={handlePrint}>
                                                    <FontAwesomeIcon icon={faPrint} /> Print
                                                </button>
                                            </div>

                                            <div className="userContentBox">
                                                <ul>
                                                    <li>
                                                        <div className="userContent">
                                                            <p>About</p>
                                                            <span>{userData?.about}</span>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="userContent">
                                                            <p>Email</p>
                                                            <span>{userData?.email}</span>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="userContent">
                                                            <p>Phone No.</p>
                                                            <span>{userData?.phoneno}</span>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="userContent">
                                                            <p>Date of Birth</p>
                                                            <span>{userData?.dob}</span>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="userContent">
                                                            <p>Gender</p>
                                                            <span>{userData?.gender}</span>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="userContent">
                                                            <p>State</p>
                                                            <span>{userData?.state}</span>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="userContent">
                                                            <p>Pincode</p>
                                                            <span>{userData?.pincode}</span>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="userContent">
                                                            <p>Joining Date</p>
                                                            <span>
                                                                {moment(userData?.created_ts).format(
                                                                    "MMMM Do YYYY, h:mm:ss a"
                                                                )}
                                                            </span>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="userContent">
                                                            <p>Email Verification</p>
                                                            <span>
                                                                {userData?.isEmailVerified
                                                                    ? "Verified"
                                                                    : "Not Verified"}
                                                            </span>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="userContent">
                                                            <p>Phone Verification</p>
                                                            <span>
                                                                {userData?.isPhoneVerified
                                                                    ? "Verified"
                                                                    : "Not Verified"}
                                                            </span>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </Tab>
                                    <Tab eventKey="product" title="Product">
                                        <div className="productMainBox">

                                            {userData && userData?.products.length >= 1 ? (
                                                <>
                                                    <div className="row">
                                                        {userData?.products.map((curElt) => {
                                                            return (
                                                                <>
                                                                    <div className="col-xl-4 col-lg-4 col-sm-4 col-sm-12 col-12">
                                                                        <div className="productBox">
                                                                            <div
                                                                                className="productImg"
                                                                                style={{
                                                                                    backgroundImage: `url(${curElt?.image1?.location})`,
                                                                                }}
                                                                            ></div>
                                                                            <div className="productDetail">
                                                                                <h4>{curElt?.title}</h4>
                                                                                <p>{curElt?.description}</p>
                                                                                <h6>₹{curElt?.price}</h6>
                                                                                <div className="actionBtn productBtn">
                                                                                    <button
                                                                                        className="response"
                                                                                        onClick={() => {
                                                                                            setSelected(curElt);
                                                                                            setImgModalShow(true);
                                                                                        }}
                                                                                    >
                                                                                        View
                                                                                    </button>
                                                                                    <button
                                                                                        className="delete"
                                                                                        onClick={() => {
                                                                                            setSelectedId(curElt._id);
                                                                                            setDeleteModal(true);
                                                                                        }}
                                                                                    >
                                                                                        Delete
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            );
                                                        })}
                                                    </div>
                                                </>
                                            ) : (
                                                <p>No Product Found</p>
                                            )}
                                        </div>
                                    </Tab>
                                    <Tab eventKey="service" title="Service">
                                        {userData && userData?.service.length >= 1 ? (
                                            <>
                                                <div className="row">
                                                    {userData?.service.map((curElt) => {
                                                        return (
                                                            <>
                                                                <div className="col-xl-4 col-lg-4 col-sm-4 col-sm-12 col-12">
                                                                    <div className="productBox">
                                                                        <div
                                                                            className="productImg service"
                                                                            style={{
                                                                                backgroundImage: `url(${curElt?.image1?.location})`,
                                                                            }}
                                                                        ></div>
                                                                        <div className="productDetail">
                                                                            <h4>{curElt?.title}</h4>
                                                                            <p>{curElt?.description}</p>
                                                                            <h6>₹{curElt?.price}</h6>
                                                                            <div className="actionBtn productBtn">
                                                                                <button
                                                                                    className="response"
                                                                                    onClick={() => {
                                                                                        setSelected(curElt);
                                                                                        setImgModalShow(true);
                                                                                    }}
                                                                                >
                                                                                    View
                                                                                </button>
                                                                                <button
                                                                                    className="delete"
                                                                                    onClick={() => {
                                                                                        setSelectedId(curElt._id);
                                                                                        setDeleteModal(true);
                                                                                    }}
                                                                                >
                                                                                    Delete
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        );
                                                    })}
                                                </div>
                                            </>
                                        ) : (
                                            <p>No Service Found</p>
                                        )}
                                    </Tab>
                                    <Tab eventKey="shout" title="Shout">
                                        {shout && shout?.length >= 1 ? (
                                            <>
                                                <div className="row">
                                                    {shout?.map(curShout => {
                                                        return (
                                                            <>
                                                                <div className="col-xl-3 col-lg-3 col-md-4 col-sm-12 col-12">
                                                                    <div className="shoutPlayerBox">
                                                                        <div className="shoutPlayer">
                                                                            <ReactPlayer
                                                                                url={curShout?.file?.location}
                                                                                controls
                                                                            />
                                                                        </div>
                                                                        <div className="actionBtn p-3">
                                                                            <button
                                                                                className="delete"

                                                                            >
                                                                                Delete
                                                                            </button>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            </>
                                                        )
                                                    })}

                                                </div>
                                            </>
                                        )
                                            :
                                            (
                                                <p>No Shout Found</p>
                                            )}
                                    </Tab>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserDetail;

function ImagePrevModal(props) {
    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <div className="addCategoryModal">
                <div className="closeModalBtn" onClick={props.onHide}>
                    <FontAwesomeIcon icon={faClose} />
                </div>
                <div className="productImgModalContent">
                    <h4>{props.selected?.title}</h4>
                    <Swiper
                        scrollbar={{
                            hide: true,
                        }}
                        modules={[Scrollbar]}
                        className="mySwiper"
                    >
                        {props.selected?.image1 ? (
                            <SwiperSlide>
                                <div
                                    className="productImgPrev"
                                    style={{
                                        backgroundImage: `url(${props.selected?.image1?.location})`,
                                    }}
                                ></div>
                            </SwiperSlide>
                        ) : (
                            ""
                        )}

                        {props.selected?.image2 ? (
                            <SwiperSlide>
                                <div
                                    className="productImgPrev"
                                    style={{
                                        backgroundImage: `url(${props.selected?.image2?.location})`,
                                    }}
                                ></div>
                            </SwiperSlide>
                        ) : (
                            ""
                        )}
                        {props.selected?.image3 ? (
                            <SwiperSlide>
                                <div
                                    className="productImgPrev"
                                    style={{
                                        backgroundImage: `url(${props.selected?.image3?.location})`,
                                    }}
                                ></div>
                            </SwiperSlide>
                        ) : (
                            ""
                        )}
                        {props.selected?.image4 ? (
                            <SwiperSlide>
                                <div
                                    className="productImgPrev"
                                    style={{
                                        backgroundImage: `url(${props.selected?.image4?.location})`,
                                    }}
                                ></div>
                            </SwiperSlide>
                        ) : (
                            ""
                        )}
                        {props.selected?.image5 ? (
                            <SwiperSlide>
                                <div
                                    className="productImgPrev"
                                    style={{
                                        backgroundImage: `url(${props.selected?.image5?.location})`,
                                    }}
                                ></div>
                            </SwiperSlide>
                        ) : (
                            ""
                        )}
                    </Swiper>
                </div>
            </div>
        </Modal>
    );
}

