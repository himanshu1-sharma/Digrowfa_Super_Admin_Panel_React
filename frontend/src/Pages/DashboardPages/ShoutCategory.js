import React, { useEffect } from 'react'
import LeftPanel from '../Includes/LeftPanel/LeftPanel'
import '../DashboardPages/Dashboard.css'
import Header from '../Includes/Header/Header'
import ShoutCategoriesTable from './DataTable/ShoutCategoryTable'
import { UserState } from '../Context'
import { useNavigate } from 'react-router-dom'

const ShoutCategory = () => {

    const { user, setUser } = UserState()
    const navigate = useNavigate()

    useEffect(() => {
        if (!(user && user.role === 'all')) {
            navigate("/login")
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
                                <h4>Categories</h4>
                            </div>
                            <div className='managementContent'>
                                <div className='contentBox'>
                                    <div className='dataTable'>
                                        <ShoutCategoriesTable />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ShoutCategory