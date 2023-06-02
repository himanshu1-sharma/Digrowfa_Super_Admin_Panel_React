import React, { useState, useEffect } from 'react'
import LeftPanel from '../Includes/LeftPanel/LeftPanel'
import '../DashboardPages/Dashboard.css'
import { Link } from 'react-router-dom'
import userIcon from '../../img/icons/userWhite.png'
import feedbackIcon from '../../img/icons/FeedbacksWhite.png'
import Reported_usersIcon from '../../img/icons/Reported_usersWhite.png'
import Reported_ProblemIcon from '../../img/icons/Reported_ProblemWhite.png'
import VerificationIcon from '../../img/icons/VerificationWhite.png'
import Header from '../Includes/Header/Header'
import { BASEURL } from '../Constant'
import Axios from 'axios'
import { UserState } from '../Context'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {

    const [data, setData] = useState()
    const { user, setUser } = UserState()
    const navigate = useNavigate()

    const fetchData = () => {
        Axios.get(`${BASEURL}api/crm/crm-data`)
            .then(data => {
                setData(data.data.data)
                // console.log("dashboard data", data.data.data)
            })
    }


    useEffect(() => {
        if (user && user.token) {
            fetchData()
        }
        else {
            navigate('/login')
        }
    }, [user])

    return (
        <>
            <Header />
            <div className='container'>
                <div className='row'>
                    <div className='col-xl-2 col-lg-12 col-md-12 col-sm-12 col-12'>
                        <div className='mobileHide'>
                            <LeftPanel />
                        </div>
                    </div>
                    <div className='col-xl-10 col-lg-12 col-md-12 col-sm-12 col-12'>
                        <div className='dashboardMainBox'>
                            <div className='title'>
                                <h4>Dashboard</h4>
                            </div>
                            <div className='dashboardCardBox'>
                                <div className='row'>
                                    {user && (user.role === "all" || user.role === "user") &&
                                        <div className='col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12'>
                                            <Link to='/users'>
                                                <div className='dashboardCard one'>
                                                    <div className='dashboardCardHeader'>
                                                        <ul>
                                                            <li>User</li>
                                                            <li>
                                                                <div className='dashboardCardIcon'>
                                                                    <img src={userIcon} alt="userIcon" className='img-fluid' />
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <div className='dashboardCardBody'>
                                                        <h2>{data?.userCount}</h2>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    }
                                    {user && (user.role === "all" || user.role === "feedback") &&
                                        <div className='col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12'>
                                            <Link to='/feedbacks'>
                                                <div className='dashboardCard two'>
                                                    <div className='dashboardCardHeader'>
                                                        <ul>
                                                            <li>Feedbacks</li>
                                                            <li>
                                                                <div className='dashboardCardIcon'>
                                                                    <img src={feedbackIcon} alt="feedbackIcon" className='img-fluid' />
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <div className='dashboardCardBody'>
                                                        <h2>{data?.feedBackData}</h2>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    }
                                    {user && (user.role === "all" || user.role === "management") &&
                                        <div className='col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12'>
                                            <Link to='/management'>
                                                <div className='dashboardCard three'>
                                                    <div className='dashboardCardHeader'>
                                                        <ul>
                                                            <li>Management</li>
                                                            <li>
                                                                <div className='dashboardCardIcon'>
                                                                    <img src={feedbackIcon} alt="feedbackIcon" className='img-fluid' />
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <div className='dashboardCardBody'>
                                                        <h2>{data?.management}</h2>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    }
                                    {user && (user.role === "all" || user.role === "reportingUser") &&
                                        <div className='col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12'>
                                            <Link to='/reported-users'>
                                                <div className='dashboardCard four'>
                                                    <div className='dashboardCardHeader'>
                                                        <ul>
                                                            <li>Reported User</li>
                                                            <li>
                                                                <div className='dashboardCardIcon'>
                                                                    <img src={Reported_usersIcon} alt="Reported_usersIcon" className='img-fluid' />
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <div className='dashboardCardBody'>
                                                        <h2>{data?.reportAbuse}</h2>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    }
                                    {user && (user.role === "all" || user.role === "reportingProblem") &&
                                        <div className='col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12'>
                                            <Link to='/reported-problem'>
                                                <div className='dashboardCard five'>
                                                    <div className='dashboardCardHeader'>
                                                        <ul>
                                                            <li>Reported Problems</li>
                                                            <li>
                                                                <div className='dashboardCardIcon'>
                                                                    <img src={Reported_ProblemIcon} alt="Reported_ProblemIcon" className='img-fluid' />
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <div className='dashboardCardBody'>
                                                        <h2>{data?.userReportedProblems}</h2>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    }
                                    {user && (user.role === "all" || user.role === "reportingProduct") &&
                                        <div className='col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12'>
                                            <Link to='/reported-product'>
                                                <div className='dashboardCard six'>
                                                    <div className='dashboardCardHeader'>
                                                        <ul>
                                                            <li>Reported Product</li>
                                                            <li>
                                                                <div className='dashboardCardIcon'>
                                                                    <img src={VerificationIcon} alt="VerificationIcon" className='img-fluid' />
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <div className='dashboardCardBody'>
                                                        <h2>{data?.productReportCount}</h2>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    }
                                    {user && (user.role === "all" || user.role === "reportingService") &&
                                        <div className='col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12'>
                                            <Link to='/reported-service'>
                                                <div className='dashboardCard seven'>
                                                    <div className='dashboardCardHeader'>
                                                        <ul>
                                                            <li>Reported Service</li>
                                                            <li>
                                                                <div className='dashboardCardIcon'>
                                                                    <img src={VerificationIcon} alt="VerificationIcon" className='img-fluid' />
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <div className='dashboardCardBody'>
                                                        <h2>{data?.serviceReportCount}</h2>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    }
                                    {user && (user.role === "all" || user.role === "verification") &&
                                        <div className='col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12'>
                                            <Link to='/verification'>
                                                <div className='dashboardCard eight'>
                                                    <div className='dashboardCardHeader'>
                                                        <ul>
                                                            <li>Verification Requests</li>
                                                            <li>
                                                                <div className='dashboardCardIcon'>
                                                                    <img src={VerificationIcon} alt="VerificationIcon" className='img-fluid' />
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <div className='dashboardCardBody'>
                                                        <h2>0</h2>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard