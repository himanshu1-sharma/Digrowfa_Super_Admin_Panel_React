import React, { useState, useEffect } from 'react'
import '../DashboardPages/Dashboard.css'
import Header from '../Includes/Header/Header'
import { BASEURL } from '../Constant'
import { UserState } from '../Context'
import Axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'


const Login = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { user, setUser } = UserState()
    const [userData, setUserData] = useState()
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await Axios.post(`${BASEURL}api/crm/admin/login`, { email, password })
                .then(data => {
                    setUserData(data.data)
                    console.log("user data", data.data)

                    if (data.data.status == true) {
                        toast.success(`${data.data.msg}`, {
                            position: "bottom-right",
                            autoClose: 1000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });

                        setUser(data.data.data)
                        localStorage.setItem('userInfo', JSON.stringify(data.data.data))
                        navigate('/')
                    }
                    else {
                        toast.error(`${data.data.msg}`, {
                            position: "bottom-right",
                            autoClose: 1000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                    }
                })
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        if (user && user.token) {
            navigate('/')
        }
    }, [user])

    console.log("user", user)

    return (
        <>
            <ToastContainer />
            <Header />
            <div className='container'>
                <div className='row'>
                    <div className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12'>
                        <div className='LoginForm'>
                            <div className="addCategoryModal">
                                <h4>Login</h4>
                                <form>
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
                                    <div className="formBtn">
                                        <button type="button" onClick={handleLogin}>Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login