import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AddEdit from '../Pages/DashboardPages/AddEdit'
import Categories from '../Pages/DashboardPages/Categories'
import Dashboard from '../Pages/DashboardPages/Dashboard'
import Feedbacks from '../Pages/DashboardPages/Feedbacks'
import Management from '../Pages/DashboardPages/Management'
import ReportedProblem from '../Pages/DashboardPages/ReportedProblem'
import ReportedUsers from '../Pages/DashboardPages/ReportedUsers'
import ReportedProduct from '../Pages/DashboardPages/ReportedProduct'
import ReportedService from '../Pages/DashboardPages/ReportedService'
import Users from '../Pages/DashboardPages/Users'
import Verification from '../Pages/DashboardPages/Verification'
import ScrollToTop from '../Pages/ScrollToTop'
import Login from '../Pages/DashboardPages/Login'
import UserDetail from '../Pages/DashboardPages/DataTable/UserDetail'
import VerificationRequest from '../Pages/DashboardPages/VerificationRequest'
import AccountDeletionRequest from '../Pages/DashboardPages/AccountDeletionRequest'
import AddUser from '../Pages/DashboardPages/AddUser'
import ShoutCategory from '../Pages/DashboardPages/ShoutCategory'

const Routers = () => {
    return (
        <>
            <ScrollToTop>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/add-edit" element={<AddEdit />} />
                    <Route path="/management" element={<Management />} />
                    <Route path="/verification" element={<Verification />} />
                    <Route path="/verification-request" element={<VerificationRequest />} />
                    <Route path="/account-deletion-request" element={<AccountDeletionRequest />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/add-user" element={<AddUser />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/shout-categories" element={<ShoutCategory />} />
                    <Route path="/feedbacks" element={<Feedbacks />} />
                    <Route path="/reported-users" element={<ReportedUsers />} />
                    <Route path="/reported-problem" element={<ReportedProblem />} />
                    <Route path="/reported-product" element={<ReportedProduct />} />
                    <Route path="/reported-service" element={<ReportedService />} />
                    <Route path="/user-detail/:name/:id" element={<UserDetail />} />
                </Routes>
            </ScrollToTop>
        </>
    )
}

export default Routers