"use client";
import React, { useEffect } from "react";
import ApproveData from './ApproveDatas'
import Adminnavbar from '../../AdminNavbar';
import DashCards from "./DashCards";
import AllUsers from './AllUsers';
const Dashboard = () => {


    useEffect(() => {
        const token = localStorage.getItem("token")
        const companyName = localStorage.getItem("companyName")
        if (!token) {
            window.location.replace('/login')
        }
        if (!companyName) {
            window.location.replace('/dashboard')
        }
    });
    return (
        <>
        
            <Adminnavbar />
            <br></br><br></br><br></br><br></br>
            <DashCards /><br></br><br></br>
            <ApproveData />
            <AllUsers />
        </>
    );
}

export default Dashboard;