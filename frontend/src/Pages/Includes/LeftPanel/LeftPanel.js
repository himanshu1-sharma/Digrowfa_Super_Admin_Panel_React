import React from 'react'
import logo from '../../../img/logo/logo.webp'
import { NavLink } from 'react-router-dom'
import './LeftPanel.css'
import dashboard from "../../../img/icons/dashboard.png"
import addEdit from "../../../img/icons/addEdit.png"
import Categories from "../../../img/icons/Categories.png"
import Feedbacks from "../../../img/icons/Feedbacks.png"
import management from "../../../img/icons/management.png"
import Reported_Problem from "../../../img/icons/Reported_Problem.png"
import Reported_users from "../../../img/icons/Reported_users.png"
import Users from "../../../img/icons/Users.png"
import Verification from "../../../img/icons/Verification.png"
import { UserState } from '../../Context'
import { useNavigate } from 'react-router-dom'


const LeftPanel = () => {

    const { user, setUser } = UserState()
    const navigate = useNavigate()

    // console.log("user", user)

    const handleLogOut = () => {
        setUser({})
        navigate('/login')
    }

    return (
        <>
            <div className='leftPanel'>
                <div className='logo'>
                    <img src={logo} alt="logo" className='img-fluid' />
                </div>
                <div className='profileBox'>
                    <div className='profileImg' style={{ backgroundImage: `url(${user?.profilepic?.location})` }}></div>
                    <div className='profileName'>
                        <h2>{user?.name}</h2>
                        <div onClick={handleLogOut} style={{ color: "red", cursor: "pointer" }}>Logout</div>
                    </div>
                </div>
                <div className='leftPanelList'>
                    <ul>

                        {user && user.role === "all" &&
                            <>
                                <NavLink exact="true" activeclassname="active" to="/">
                                    <li>
                                        <div className='leftPanelListIcon'><img src={dashboard} alt="dashboard" className='img-fluid' /> </div>
                                        <div className='leftPanelListName'>Dashboard</div>
                                    </li>
                                </NavLink>

                                <NavLink exact="true" activeclassname="active" to="/categories">
                                    <li>
                                        <div className='leftPanelListIcon'><img src={Categories} alt="Categories" className='img-fluid' /></div>
                                        <div className='leftPanelListName'>Categories</div>
                                    </li>
                                </NavLink>

                                <NavLink exact="true" activeclassname="active" to="/shout-categories">
                                    <li>
                                        <div className='leftPanelListIcon'><img src={Categories} alt="Categories" className='img-fluid' /></div>
                                        <div className='leftPanelListName'>Shout Categories</div>
                                    </li>
                                </NavLink>

                                <NavLink exact="true" activeclassname="active" to="/add-edit">
                                    <li>
                                        <div className='leftPanelListIcon'><img src={addEdit} alt="addEdit" className='img-fluid' /></div>
                                        <div className='leftPanelListName'>Add/Edit</div>
                                    </li>
                                </NavLink>
                            </>
                        }

                        {user && (user.role === "all" || user.role === "management") &&
                            <NavLink exact="true" activeclassname="active" to="/management">
                                <li>
                                    <div className='leftPanelListIcon'><img src={management} alt="management" className='img-fluid' /></div>
                                    <div className='leftPanelListName'>Management</div>
                                </li>
                            </NavLink>
                        }
                        {user && (user.role === "all" || user.role === "verification") &&
                            <NavLink exact="true" activeclassname="active" to="/verification">
                                <li>
                                    <div className='leftPanelListIcon'><img src={Verification} alt="Verification" className='img-fluid' /></div>
                                    <div className='leftPanelListName'>Verification</div>
                                </li>
                            </NavLink>
                        }
                        {user && (user.role === "all" || user.role === "user") &&
                            <NavLink exact="true" activeclassname="active" to="/users">
                                <li>
                                    <div className='leftPanelListIcon'><img src={Users} alt="Users" className='img-fluid' /></div>
                                    <div className='leftPanelListName'>Users</div>
                                </li>
                            </NavLink>
                        }
                        {user && (user.role === "all" || user.role === "user") &&
                            <NavLink exact="true" activeclassname="active" to="/add-user">
                                <li>
                                    <div className='leftPanelListIcon'><img src={Users} alt="Users" className='img-fluid' /></div>
                                    <div className='leftPanelListName'>Add Users</div>
                                </li>
                            </NavLink>
                        }

                        {user && (user.role === "all" || user.role === "feedback") &&
                            <NavLink exact="true" activeclassname="active" to="/feedbacks">
                                <li>
                                    <div className='leftPanelListIcon'><img src={Feedbacks} alt="Feedbacks" className='img-fluid' /></div>
                                    <div className='leftPanelListName'>Feedbacks</div>
                                </li>
                            </NavLink>
                        }
                        {user && (user.role === "all" || user.role === "reportingUser") &&
                            <NavLink exact="true" activeclassname="active" to="/reported-users">
                                <li>
                                    <div className='leftPanelListIcon'><img src={Reported_users} alt="Reported_users" className='img-fluid' /></div>
                                    <div className='leftPanelListName'>Reported users</div>
                                </li>
                            </NavLink>
                        }
                        {user && (user.role === "all" || user.role === "reportingProblem") &&
                            <NavLink exact="true" activeclassname="active" to="/reported-problem">
                                <li>
                                    <div className='leftPanelListIcon'><img src={Reported_Problem} alt="Reported_Problem" className='img-fluid' /></div>
                                    <div className='leftPanelListName'>Reported Problem</div>
                                </li>
                            </NavLink>
                        }
                        {user && (user.role === "all" || user.role === "reportingProduct") &&
                            <NavLink exact="true" activeclassname="active" to="/reported-product">
                                <li>
                                    <div className='leftPanelListIcon'><img src={Reported_Problem} alt="Reported_Product" className='img-fluid' /></div>
                                    <div className='leftPanelListName'>Reported Product</div>
                                </li>
                            </NavLink>
                        }
                        {user && (user.role === "all" || user.role === "reportingService") &&
                            <NavLink exact="true" activeclassname="active" to="/reported-service">
                                <li>
                                    <div className='leftPanelListIcon'><img src={Reported_Problem} alt="Reported_Service" className='img-fluid' /></div>
                                    <div className='leftPanelListName'>Reported Service</div>
                                </li>
                            </NavLink>
                        }
                        {user && (user.role === "all" || user.role === "reportingService") &&
                            <NavLink exact="true" activeclassname="active" to="/verification-request">
                                <li>
                                    <div className='leftPanelListIcon'><img src={Reported_Problem} alt="Reported_Service" className='img-fluid' /></div>
                                    <div className='leftPanelListName'>Verification Request</div>
                                </li>
                            </NavLink>
                        }
                        {user && (user.role === "all" || user.role === "reportingService") &&
                            <NavLink exact="true" activeclassname="active" to="/account-deletion-request">
                                <li>
                                    <div className='leftPanelListIcon'><img src={Reported_Problem} alt="Reported_Service" className='img-fluid' /></div>
                                    <div className='leftPanelListName'>Account Deletion Request</div>
                                </li>
                            </NavLink>
                        }
                        {/* <Link>
                            <li>
                                <div className='leftPanelListIcon'><img src={logout} alt="logout" className='img-fluid' /></div>
                                <div className='leftPanelListName' onClick={handleLogOut} style={{ color: "red" }}>Logout</div>
                            </li>
                        </Link> */}
                    </ul>
                </div>
            </div>
        </>
    )
}

export default LeftPanel